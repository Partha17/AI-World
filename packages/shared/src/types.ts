export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  seller_id: string;
  category: string;
  subcategory: string | null;
  materials: Record<string, unknown>;
  gemstones: Record<string, unknown> | null;
  weight_grams: number | null;
  karat: number | null;
  images: string[];
  thumbnail_url: string;
  style_tags: string[];
  occasion_tags: string[];
  is_active: boolean;
  created_at: string;
}

export interface Seller {
  id: string;
  name: string;
  brand_name: string;
  description: string | null;
  logo_url: string | null;
  rating: number;
  verified: boolean;
  location: string | null;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  budget_range: { min: number; max: number } | null;
  style_preferences: string[];
  favorite_materials: string[];
  ring_size: string | null;
  preferred_occasions: string[];
}

export interface Conversation {
  id: string;
  user_id: string | null;
  title: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export type MessageRole = "user" | "assistant" | "tool";

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  metadata: MessageMetadata | null;
  created_at: string;
}

export interface MessageMetadata {
  products?: ProductCard[];
  suggestions?: string[];
  tool_calls?: ToolCallInfo[];
}

export interface ProductCard {
  id: string;
  name: string;
  price: number;
  currency: string;
  thumbnail_url: string;
  category: string;
  materials: Record<string, unknown>;
}

export interface ToolCallInfo {
  tool: string;
  args: Record<string, unknown>;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  user_id?: string;
}

export interface ChatStreamEvent {
  type: "text" | "products" | "suggestions" | "done" | "error";
  data: unknown;
}
