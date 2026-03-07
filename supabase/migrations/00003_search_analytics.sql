-- ============================================================
-- Search analytics for trending/recommendations
-- ============================================================
create table public.search_events (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  query text not null,
  result_count int default 0,
  clicked_product_id uuid references public.products(id) on delete set null,
  created_at timestamptz default now()
);

create index idx_search_events_building on public.search_events (building_id, created_at desc);
create index idx_search_events_product on public.search_events (clicked_product_id) where clicked_product_id is not null;

-- Featured products per building (admin-curated)
create table public.building_featured_products (
  building_id uuid not null references public.buildings(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int default 0,
  label text,
  created_at timestamptz default now(),
  primary key (building_id, product_id)
);

-- Trending products: most clicked in a building in the last 7 days
create or replace function public.trending_products(
  p_building_id uuid,
  p_limit int default 12
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
  click_count bigint
)
language sql stable
as $$
  select
    p.id, p.name, p.description, p.price, p.currency,
    p.category, p.subcategory, p.materials, p.gemstones,
    p.thumbnail_url, p.images, p.style_tags, p.occasion_tags,
    p.seller_id, s.brand_name, s.verified,
    bv.shop_name, bv.floor_number,
    count(se.id) as click_count
  from public.search_events se
  join public.products p on p.id = se.clicked_product_id
  join public.sellers s on s.id = p.seller_id
  join public.building_vendors bv on bv.seller_id = p.seller_id
    and bv.building_id = p_building_id and bv.is_active = true
  where se.building_id = p_building_id
    and se.created_at > now() - interval '7 days'
    and se.clicked_product_id is not null
    and p.is_active = true
  group by p.id, s.brand_name, s.verified, bv.shop_name, bv.floor_number
  order by click_count desc
  limit p_limit;
$$;

-- RLS
alter table public.search_events enable row level security;
alter table public.building_featured_products enable row level security;

create policy "Search events: insert-only for everyone"
  on public.search_events for insert with check (true);

create policy "Featured products: read for everyone"
  on public.building_featured_products for select using (true);
