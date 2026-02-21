export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string | null
          id: string
          summary: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_embeddings: {
        Row: {
          created_at: string | null
          embedding: string
          id: string
          model_version: string
          product_id: string
          text_content: string
        }
        Insert: {
          created_at?: string | null
          embedding: string
          id?: string
          model_version?: string
          product_id: string
          text_content: string
        }
        Update: {
          created_at?: string | null
          embedding?: string
          id?: string
          model_version?: string
          product_id?: string
          text_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_embeddings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          currency: string
          description: string
          gemstones: Json | null
          id: string
          images: string[]
          is_active: boolean | null
          karat: number | null
          materials: Json
          name: string
          occasion_tags: string[]
          price: number
          seller_id: string
          style_tags: string[]
          subcategory: string | null
          thumbnail_url: string
          updated_at: string | null
          weight_grams: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          currency?: string
          description: string
          gemstones?: Json | null
          id?: string
          images?: string[]
          is_active?: boolean | null
          karat?: number | null
          materials?: Json
          name: string
          occasion_tags?: string[]
          price: number
          seller_id: string
          style_tags?: string[]
          subcategory?: string | null
          thumbnail_url: string
          updated_at?: string | null
          weight_grams?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          currency?: string
          description?: string
          gemstones?: Json | null
          id?: string
          images?: string[]
          is_active?: boolean | null
          karat?: number | null
          materials?: Json
          name?: string
          occasion_tags?: string[]
          price?: number
          seller_id?: string
          style_tags?: string[]
          subcategory?: string | null
          thumbnail_url?: string
          updated_at?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          brand_name: string
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          logo_url: string | null
          name: string
          rating: number | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          brand_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name: string
          rating?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          brand_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          name?: string
          rating?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      user_context_vectors: {
        Row: {
          context_embedding: string
          context_summary: string
          context_type: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_embedding: string
          context_summary: string
          context_type?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_embedding?: string
          context_summary?: string
          context_type?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          budget_range: Json | null
          created_at: string | null
          display_name: string | null
          favorite_materials: string[] | null
          id: string
          onboarding_completed: boolean | null
          preferred_occasions: string[] | null
          ring_size: string | null
          style_preferences: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          budget_range?: Json | null
          created_at?: string | null
          display_name?: string | null
          favorite_materials?: string[] | null
          id: string
          onboarding_completed?: boolean | null
          preferred_occasions?: string[] | null
          ring_size?: string | null
          style_preferences?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          budget_range?: Json | null
          created_at?: string | null
          display_name?: string | null
          favorite_materials?: string[] | null
          id?: string
          onboarding_completed?: boolean | null
          preferred_occasions?: string[] | null
          ring_size?: string | null
          style_preferences?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_similar_products: {
        Args: { match_count?: number; target_product_id: string }
        Returns: {
          category: string
          currency: string
          description: string
          id: string
          name: string
          price: number
          similarity: number
          thumbnail_url: string
        }[]
      }
      match_products: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          currency: string
          description: string
          gemstones: Json
          id: string
          images: string[]
          materials: Json
          name: string
          occasion_tags: string[]
          price: number
          similarity: number
          style_tags: string[]
          subcategory: string
          thumbnail_url: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
