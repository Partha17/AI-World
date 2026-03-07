-- ============================================================
-- Migration: Building multi-tenancy + hybrid search
-- ============================================================

-- ============================================================
-- Buildings (tenants) — each gold building/jewelry mall
-- ============================================================
create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  address text,
  city text not null,
  state text,
  location jsonb,
  branding jsonb not null default '{}',
  featured_categories text[],
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_buildings_slug on public.buildings (slug) where is_active = true;

-- ============================================================
-- Building–Vendor junction (which vendors are in which building)
-- ============================================================
create table public.building_vendors (
  building_id uuid not null references public.buildings(id) on delete cascade,
  seller_id uuid not null references public.sellers(id) on delete cascade,
  floor_number text,
  shop_name text,
  is_active boolean default true,
  created_at timestamptz default now(),
  primary key (building_id, seller_id)
);

create index idx_building_vendors_building on public.building_vendors (building_id) where is_active = true;
create index idx_building_vendors_seller on public.building_vendors (seller_id);

-- ============================================================
-- Add tsvector column for full-text search on products
-- ============================================================
alter table public.products add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(subcategory, '')), 'C')
  ) stored;

create index idx_products_search_vector on public.products using gin (search_vector);

-- ============================================================
-- Fix embedding dimensions: Gemini outputs 3072, schema was 1536
-- ============================================================
alter table public.product_embeddings
  alter column embedding type vector(3072);

drop index if exists idx_product_embeddings_ivfflat;
-- pgvector on Supabase caps indexed dims at 2000; 3072-dim vectors use exact scan
-- which is fast enough for catalog-sized datasets (< 100k products)

alter table public.user_context_vectors
  alter column context_embedding type vector(3072);

drop index if exists idx_user_context_embedding;

-- ============================================================
-- Update match_products to use 3072 dimensions
-- ============================================================
create or replace function public.match_products(
  query_embedding vector(3072),
  match_threshold float default 0.5,
  match_count int default 10
)
returns table (
  id uuid,
  name text,
  description text,
  price numeric,
  currency text,
  category text,
  subcategory text,
  materials jsonb,
  gemstones jsonb,
  thumbnail_url text,
  images text[],
  style_tags text[],
  occasion_tags text[],
  similarity float
)
language sql stable
as $$
  select
    p.id, p.name, p.description, p.price, p.currency,
    p.category, p.subcategory, p.materials, p.gemstones,
    p.thumbnail_url, p.images, p.style_tags, p.occasion_tags,
    1 - (pe.embedding <=> query_embedding) as similarity
  from public.product_embeddings pe
  join public.products p on p.id = pe.product_id
  where p.is_active = true
    and 1 - (pe.embedding <=> query_embedding) > match_threshold
  order by pe.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- Update find_similar_products for 3072 dimensions
-- ============================================================
create or replace function public.find_similar_products(
  target_product_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  name text,
  description text,
  price numeric,
  currency text,
  category text,
  thumbnail_url text,
  similarity float
)
language sql stable
as $$
  select
    p.id, p.name, p.description, p.price, p.currency,
    p.category, p.thumbnail_url,
    1 - (pe.embedding <=> target.embedding) as similarity
  from public.product_embeddings target
  cross join lateral (
    select pe2.product_id, pe2.embedding
    from public.product_embeddings pe2
    where pe2.product_id != target_product_id
    order by pe2.embedding <=> target.embedding
    limit match_count
  ) pe
  join public.products p on p.id = pe.product_id
  where target.product_id = target_product_id
    and p.is_active = true
  order by similarity desc;
$$;

-- ============================================================
-- Hybrid search: vector + full-text + fuzzy, scoped to building
-- ============================================================
create or replace function public.hybrid_search(
  p_building_id uuid,
  p_query_text text,
  p_query_embedding vector(3072),
  p_match_count int default 20,
  p_category text default null,
  p_subcategory text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_occasion text default null,
  p_style text default null,
  p_seller_id uuid default null,
  p_vector_weight float default 0.5,
  p_text_weight float default 0.3,
  p_fuzzy_weight float default 0.2
)
returns table (
  id uuid,
  name text,
  description text,
  price numeric,
  currency text,
  category text,
  subcategory text,
  materials jsonb,
  gemstones jsonb,
  thumbnail_url text,
  images text[],
  style_tags text[],
  occasion_tags text[],
  seller_id uuid,
  seller_name text,
  seller_verified boolean,
  shop_name text,
  floor_number text,
  score float
)
language plpgsql stable
as $$
declare
  ts_query tsquery;
begin
  ts_query := plainto_tsquery('english', p_query_text);

  return query
  with building_products as (
    select p.*, bv.shop_name as bv_shop_name, bv.floor_number as bv_floor_number,
           s.brand_name as s_brand_name, s.verified as s_verified
    from public.products p
    join public.building_vendors bv on bv.seller_id = p.seller_id
      and bv.building_id = p_building_id
      and bv.is_active = true
    join public.sellers s on s.id = p.seller_id
    where p.is_active = true
      and (p_category is null or p.category = p_category)
      and (p_subcategory is null or p.subcategory = p_subcategory)
      and (p_min_price is null or p.price >= p_min_price)
      and (p_max_price is null or p.price <= p_max_price)
      and (p_occasion is null or p.occasion_tags @> array[p_occasion])
      and (p_style is null or p.style_tags @> array[p_style])
      and (p_seller_id is null or p.seller_id = p_seller_id)
  ),
  vector_scores as (
    select pe.product_id,
           1 - (pe.embedding <=> p_query_embedding) as vec_score
    from public.product_embeddings pe
    where pe.product_id in (select bp.id from building_products bp)
  ),
  text_scores as (
    select bp.id as product_id,
           case
             when ts_query::text = '' then 0
             else ts_rank_cd(bp.search_vector, ts_query, 32)
           end as txt_score
    from building_products bp
  ),
  fuzzy_scores as (
    select bp.id as product_id,
           similarity(bp.name, p_query_text) as fuz_score
    from building_products bp
  ),
  combined as (
    select
      bp.id,
      coalesce(vs.vec_score, 0) as vec_score,
      coalesce(ts.txt_score, 0) as txt_score,
      coalesce(fs.fuz_score, 0) as fuz_score
    from building_products bp
    left join vector_scores vs on vs.product_id = bp.id
    left join text_scores ts on ts.product_id = bp.id
    left join fuzzy_scores fs on fs.product_id = bp.id
  ),
  ranked as (
    select
      c.id,
      (p_vector_weight * c.vec_score +
       p_text_weight * c.txt_score +
       p_fuzzy_weight * c.fuz_score) as final_score
    from combined c
    where c.vec_score > 0.05 or c.txt_score > 0 or c.fuz_score > 0.1
  )
  select
    bp.id, bp.name, bp.description, bp.price, bp.currency,
    bp.category, bp.subcategory, bp.materials, bp.gemstones,
    bp.thumbnail_url, bp.images, bp.style_tags, bp.occasion_tags,
    bp.seller_id, bp.s_brand_name, bp.s_verified,
    bp.bv_shop_name, bp.bv_floor_number,
    r.final_score
  from ranked r
  join building_products bp on bp.id = r.id
  order by r.final_score desc
  limit p_match_count;
end;
$$;

-- ============================================================
-- Building-scoped browse (no search query, just filters)
-- ============================================================
create or replace function public.building_browse(
  p_building_id uuid,
  p_category text default null,
  p_subcategory text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_seller_id uuid default null,
  p_sort_by text default 'created_at',
  p_sort_order text default 'desc',
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id uuid,
  name text,
  description text,
  price numeric,
  currency text,
  category text,
  subcategory text,
  materials jsonb,
  gemstones jsonb,
  thumbnail_url text,
  images text[],
  style_tags text[],
  occasion_tags text[],
  seller_id uuid,
  seller_name text,
  seller_verified boolean,
  shop_name text,
  floor_number text,
  total_count bigint
)
language plpgsql stable
as $$
declare
  _total bigint;
begin
  select count(*) into _total
  from public.products p
  join public.building_vendors bv on bv.seller_id = p.seller_id
    and bv.building_id = p_building_id and bv.is_active = true
  where p.is_active = true
    and (p_category is null or p.category = p_category)
    and (p_subcategory is null or p.subcategory = p_subcategory)
    and (p_min_price is null or p.price >= p_min_price)
    and (p_max_price is null or p.price <= p_max_price)
    and (p_seller_id is null or p.seller_id = p_seller_id);

  return query
  select
    p.id, p.name, p.description, p.price, p.currency,
    p.category, p.subcategory, p.materials, p.gemstones,
    p.thumbnail_url, p.images, p.style_tags, p.occasion_tags,
    p.seller_id, s.brand_name, s.verified,
    bv.shop_name, bv.floor_number,
    _total
  from public.products p
  join public.building_vendors bv on bv.seller_id = p.seller_id
    and bv.building_id = p_building_id and bv.is_active = true
  join public.sellers s on s.id = p.seller_id
  where p.is_active = true
    and (p_category is null or p.category = p_category)
    and (p_subcategory is null or p.subcategory = p_subcategory)
    and (p_min_price is null or p.price >= p_min_price)
    and (p_max_price is null or p.price <= p_max_price)
    and (p_seller_id is null or p.seller_id = p_seller_id)
  order by
    case when p_sort_by = 'price' and p_sort_order = 'asc' then p.price end asc,
    case when p_sort_by = 'price' and p_sort_order = 'desc' then p.price end desc,
    case when p_sort_by = 'name' and p_sort_order = 'asc' then p.name end asc,
    case when p_sort_by = 'name' and p_sort_order = 'desc' then p.name end desc,
    case when p_sort_by = 'created_at' and p_sort_order = 'desc' then p.created_at end desc,
    case when p_sort_by = 'created_at' and p_sort_order = 'asc' then p.created_at end asc
  limit p_limit offset p_offset;
end;
$$;

-- ============================================================
-- Category counts for a building
-- ============================================================
create or replace function public.building_categories(
  p_building_id uuid
)
returns table (
  category text,
  product_count bigint
)
language sql stable
as $$
  select p.category, count(*) as product_count
  from public.products p
  join public.building_vendors bv on bv.seller_id = p.seller_id
    and bv.building_id = p_building_id and bv.is_active = true
  where p.is_active = true
  group by p.category
  order by product_count desc;
$$;

-- ============================================================
-- RLS for new tables
-- ============================================================
alter table public.buildings enable row level security;
alter table public.building_vendors enable row level security;

create policy "Buildings are viewable by everyone"
  on public.buildings for select using (is_active = true);

create policy "Building vendors are viewable by everyone"
  on public.building_vendors for select using (is_active = true);

-- ============================================================
-- Triggers for updated_at on new tables
-- ============================================================
create trigger on_buildings_updated
  before update on public.buildings
  for each row execute function public.handle_updated_at();
