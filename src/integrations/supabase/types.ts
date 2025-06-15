export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_ads: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          message: string | null
          start_date: string | null
          target_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          start_date?: string | null
          target_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          start_date?: string | null
          target_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          permission_type: string
          updated_at: string
          user_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          permission_type: string
          updated_at?: string
          user_email: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          permission_type?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      card_searches: {
        Row: {
          card_number: string
          created_at: string | null
          id: string
          searcher_email: string | null
          searcher_phone: string | null
        }
        Insert: {
          card_number: string
          created_at?: string | null
          id?: string
          searcher_email?: string | null
          searcher_phone?: string | null
        }
        Update: {
          card_number?: string
          created_at?: string | null
          id?: string
          searcher_email?: string | null
          searcher_phone?: string | null
        }
        Relationships: []
      }
      mcards: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          email: string | null
          full_name: string
          id: string
          is_published: boolean
          job_title: string | null
          phone_number: string | null
          plan: string
          profile_picture_url: string | null
          slug: string
          social_links: Json | null
          subscription_expires_at: string
          subscription_status: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_published?: boolean
          job_title?: string | null
          phone_number?: string | null
          plan?: string
          profile_picture_url?: string | null
          slug: string
          social_links?: Json | null
          subscription_expires_at?: string
          subscription_status?: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_published?: boolean
          job_title?: string | null
          phone_number?: string | null
          plan?: string
          profile_picture_url?: string | null
          slug?: string
          social_links?: Json | null
          subscription_expires_at?: string
          subscription_status?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          card_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          reported_card_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          reported_card_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          card_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          reported_card_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "user_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_reported_card_id_fkey"
            columns: ["reported_card_id"]
            isOneToOne: false
            referencedRelation: "reported_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string
          enable_security_notifications: boolean
          first_name: string | null
          id: string
          is_on_vacation: boolean
          last_name: string | null
          phone: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          enable_security_notifications?: boolean
          first_name?: string | null
          id: string
          is_on_vacation?: boolean
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          enable_security_notifications?: boolean
          first_name?: string | null
          id?: string
          is_on_vacation?: boolean
          last_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          is_paid: boolean
          total_earnings: number
          usage_count: number
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          is_paid?: boolean
          total_earnings?: number
          usage_count?: number
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          is_paid?: boolean
          total_earnings?: number
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      promo_usage: {
        Row: {
          admin_confirmed_by: string | null
          card_search_id: string | null
          created_at: string
          discount_amount: number
          id: string
          is_paid: boolean
          paid_at: string | null
          promo_code_id: string
          reported_card_id: string | null
          used_by_email: string | null
          used_by_phone: string | null
        }
        Insert: {
          admin_confirmed_by?: string | null
          card_search_id?: string | null
          created_at?: string
          discount_amount?: number
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          promo_code_id: string
          reported_card_id?: string | null
          used_by_email?: string | null
          used_by_phone?: string | null
        }
        Update: {
          admin_confirmed_by?: string | null
          card_search_id?: string | null
          created_at?: string
          discount_amount?: number
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          promo_code_id?: string
          reported_card_id?: string | null
          used_by_email?: string | null
          used_by_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_usage_card_search_id_fkey"
            columns: ["card_search_id"]
            isOneToOne: false
            referencedRelation: "card_searches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_usage_reported_card_id_fkey"
            columns: ["reported_card_id"]
            isOneToOne: false
            referencedRelation: "reported_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      reported_cards: {
        Row: {
          card_number: string
          created_at: string
          description: string | null
          document_type: string
          found_date: string
          id: string
          location: string
          photo_url: string | null
          promo_code_id: string | null
          recovery_base_fee: number | null
          recovery_currency: string | null
          recovery_currency_symbol: string | null
          recovery_final_price: number | null
          reporter_id: string
          reporter_phone: string | null
          status: string | null
        }
        Insert: {
          card_number: string
          created_at?: string
          description?: string | null
          document_type?: string
          found_date: string
          id?: string
          location: string
          photo_url?: string | null
          promo_code_id?: string | null
          recovery_base_fee?: number | null
          recovery_currency?: string | null
          recovery_currency_symbol?: string | null
          recovery_final_price?: number | null
          reporter_id: string
          reporter_phone?: string | null
          status?: string | null
        }
        Update: {
          card_number?: string
          created_at?: string
          description?: string | null
          document_type?: string
          found_date?: string
          id?: string
          location?: string
          photo_url?: string | null
          promo_code_id?: string | null
          recovery_base_fee?: number | null
          recovery_currency?: string | null
          recovery_currency_symbol?: string | null
          recovery_final_price?: number | null
          reporter_id?: string
          reporter_phone?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reported_cards_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cards: {
        Row: {
          card_holder_name: string | null
          card_number: string
          created_at: string
          document_type: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          card_holder_name?: string | null
          card_number: string
          created_at?: string
          document_type?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          card_holder_name?: string | null
          card_number?: string
          created_at?: string
          document_type?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_activate_promo_code: {
        Args: { promo_code_text: string }
        Returns: boolean
      }
      admin_approve_mcard_subscription: {
        Args: { p_mcard_id: string }
        Returns: {
          success: boolean
          message: string
        }[]
      }
      admin_get_all_promo_codes: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          code: string
          is_active: boolean
          is_paid: boolean
          created_at: string
          expires_at: string
          total_earnings: number
          usage_count: number
          user_email: string
          user_name: string
          user_phone: string
        }[]
      }
      admin_get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
          first_name: string
          last_name: string
          phone: string
          country: string
        }[]
      }
      admin_get_pending_mcards: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          full_name: string
          plan: string
          created_at: string
          user_email: string
          user_phone: string
        }[]
      }
      can_activate_promo_codes: {
        Args: { user_email: string }
        Returns: boolean
      }
      generate_promo_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          user_email: string
          action: string
          details: Json
          ip_address: string
        }[]
      }
      get_daily_user_signups: {
        Args: Record<PropertyKey, never>
        Returns: {
          signup_date: string
          count: number
        }[]
      }
      get_public_ads: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          message: string | null
          start_date: string | null
          target_url: string | null
          title: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_login_event: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
