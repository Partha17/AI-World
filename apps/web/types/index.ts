export interface Building {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  city: string;
  state: string | null;
  branding: BuildingBranding;
  featured_categories: string[];
}

export interface BuildingBranding {
  logo_url?: string;
  primary_color?: string;
  welcome_message?: string;
  theme?: string;
}

export interface BuildingVendor {
  seller_id: string;
  brand_name: string;
  shop_name: string | null;
  floor_number: string | null;
  verified: boolean;
  logo_url: string | null;
}

export interface BuildingDetail {
  building: Building;
  vendors: BuildingVendor[];
}

export interface ProductCard {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  subcategory: string | null;
  materials: Record<string, unknown>;
  gemstones: Record<string, unknown> | null;
  thumbnail_url: string;
  images: string[];
  style_tags: string[];
  occasion_tags: string[];
  seller_id: string | null;
  seller_name: string | null;
  seller_verified: boolean | null;
  shop_name: string | null;
  floor_number: string | null;
  score: number | null;
}

export interface SearchResponse {
  products: ProductCard[];
  total: number;
  page: number;
  limit: number;
  query: string;
  parsed: ParsedQuery | null;
}

export interface ParsedQuery {
  category: string | null;
  subcategory: string | null;
  min_price: number | null;
  max_price: number | null;
  materials: string[] | null;
  gemstones: string[] | null;
  occasion: string | null;
  style: string | null;
  semantic_query: string;
}

export interface BrowseResponse {
  products: ProductCard[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface ProductDetail extends ProductCard {
  weight_grams: number | null;
  karat: number | null;
  seller_rating: number | null;
  seller_logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SimilarProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  thumbnail_url: string;
  similarity: number;
}
