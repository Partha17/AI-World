-- Enable pgvector for embedding storage and similarity search
create extension if not exists vector with schema public;

-- Enable pg_trgm for text search
create extension if not exists pg_trgm with schema public;

-- ============================================================
-- Sellers
-- ============================================================
create table public.sellers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_name text not null,
  description text,
  logo_url text,
  rating numeric(2,1) default 0.0 check (rating >= 0 and rating <= 5),
  verified boolean default false,
  location text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_sellers_verified on public.sellers (verified) where verified = true;

-- ============================================================
-- Products
-- ============================================================
create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  name text not null,
  description text not null,
  price numeric(12,2) not null check (price > 0),
  currency text not null default 'INR',
  category text not null,
  subcategory text,
  materials jsonb not null default '{}',
  gemstones jsonb,
  weight_grams numeric(8,2),
  karat integer,
  images text[] not null default '{}',
  thumbnail_url text not null,
  style_tags text[] not null default '{}',
  occasion_tags text[] not null default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_category on public.products (category);
create index idx_products_subcategory on public.products (subcategory);
create index idx_products_price on public.products (price);
create index idx_products_seller on public.products (seller_id);
create index idx_products_active on public.products (is_active) where is_active = true;
create index idx_products_style_tags on public.products using gin (style_tags);
create index idx_products_occasion_tags on public.products using gin (occasion_tags);
create index idx_products_materials on public.products using gin (materials);
create index idx_products_name_trgm on public.products using gin (name gin_trgm_ops);

-- ============================================================
-- Product Embeddings (pgvector)
-- ============================================================
create table public.product_embeddings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  embedding vector(1536) not null,
  text_content text not null,
  model_version text not null default 'text-embedding-3-small',
  created_at timestamptz default now(),
  unique (product_id)
);

create index idx_product_embeddings_ivfflat
  on public.product_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================================
-- User Profiles (extends Supabase auth.users)
-- ============================================================
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  budget_range jsonb,
  style_preferences text[] default '{}',
  favorite_materials text[] default '{}',
  ring_size text,
  preferred_occasions text[] default '{}',
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- User Context Vectors (evolving preference embeddings)
-- ============================================================
create table public.user_context_vectors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context_embedding vector(1536) not null,
  context_summary text not null,
  context_type text not null default 'preference',
  updated_at timestamptz default now()
);

create index idx_user_context_user on public.user_context_vectors (user_id);
create index idx_user_context_embedding
  on public.user_context_vectors
  using ivfflat (context_embedding vector_cosine_ops)
  with (lists = 50);

-- ============================================================
-- Conversations
-- ============================================================
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text,
  summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_conversations_user on public.conversations (user_id);

-- ============================================================
-- Messages
-- ============================================================
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'tool')),
  content text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_messages_conversation on public.messages (conversation_id, created_at);

-- ============================================================
-- Wishlist
-- ============================================================
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- ============================================================
-- Functions: semantic search over product embeddings
-- ============================================================
create or replace function public.match_products(
  query_embedding vector(1536),
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
    p.id,
    p.name,
    p.description,
    p.price,
    p.currency,
    p.category,
    p.subcategory,
    p.materials,
    p.gemstones,
    p.thumbnail_url,
    p.images,
    p.style_tags,
    p.occasion_tags,
    1 - (pe.embedding <=> query_embedding) as similarity
  from public.product_embeddings pe
  join public.products p on p.id = pe.product_id
  where p.is_active = true
    and 1 - (pe.embedding <=> query_embedding) > match_threshold
  order by pe.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- Functions: find similar products to a given product
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
    p.id,
    p.name,
    p.description,
    p.price,
    p.currency,
    p.category,
    p.thumbnail_url,
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
-- Row Level Security
-- ============================================================
alter table public.sellers enable row level security;
alter table public.products enable row level security;
alter table public.product_embeddings enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_context_vectors enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.wishlists enable row level security;

-- Public read for products and sellers
create policy "Products are viewable by everyone"
  on public.products for select using (is_active = true);

create policy "Sellers are viewable by everyone"
  on public.sellers for select using (true);

create policy "Product embeddings viewable by everyone"
  on public.product_embeddings for select using (true);

-- User profile: own data only
create policy "Users can view own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert with check (auth.uid() = id);

-- Conversations: own data only
create policy "Users can view own conversations"
  on public.conversations for select using (auth.uid() = user_id);

create policy "Users can create conversations"
  on public.conversations for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own conversations"
  on public.conversations for update using (auth.uid() = user_id);

-- Messages: accessible via conversation ownership
create policy "Users can view messages in own conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.user_id = auth.uid() or c.user_id is null)
    )
  );

create policy "Users can insert messages in own conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.user_id = auth.uid() or c.user_id is null)
    )
  );

-- User context vectors: own data only
create policy "Users can view own context"
  on public.user_context_vectors for select using (auth.uid() = user_id);

create policy "Users can manage own context"
  on public.user_context_vectors for all using (auth.uid() = user_id);

-- Wishlists: own data only
create policy "Users can view own wishlist"
  on public.wishlists for select using (auth.uid() = user_id);

create policy "Users can manage own wishlist"
  on public.wishlists for all using (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_sellers_updated
  before update on public.sellers
  for each row execute function public.handle_updated_at();

create trigger on_products_updated
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger on_user_profiles_updated
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger on_conversations_updated
  before update on public.conversations
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Trigger: auto-create user profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
