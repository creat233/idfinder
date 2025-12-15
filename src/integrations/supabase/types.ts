export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      admin_messages: {
        Row: {
          card_id: string
          card_info: Json | null
          content: string
          created_at: string
          id: string
          message_type: string
          metadata: Json | null
          owner_info: Json | null
          price_info: Json | null
          priority: string | null
          processed_at: string | null
          processed_by: string | null
          promo_info: Json | null
          status: string | null
          title: string
        }
        Insert: {
          card_id: string
          card_info?: Json | null
          content: string
          created_at?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          owner_info?: Json | null
          price_info?: Json | null
          priority?: string | null
          processed_at?: string | null
          processed_by?: string | null
          promo_info?: Json | null
          status?: string | null
          title: string
        }
        Update: {
          card_id?: string
          card_info?: Json | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          owner_info?: Json | null
          price_info?: Json | null
          priority?: string | null
          processed_at?: string | null
          processed_by?: string | null
          promo_info?: Json | null
          status?: string | null
          title?: string
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
      auto_reply_settings: {
        Row: {
          created_at: string
          custom_message: string | null
          enabled: boolean
          id: string
          selected_message: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_message?: string | null
          enabled?: boolean
          id?: string
          selected_message?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_message?: string | null
          enabled?: boolean
          id?: string
          selected_message?: string
          updated_at?: string
          user_id?: string
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
      featured_mcards: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number | null
          id: string
          is_active: boolean
          mcard_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          mcard_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          mcard_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_mcards_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_analytics: {
        Row: {
          created_at: string
          favorites_count: number
          id: string
          likes_count: number
          mcard_id: string
          shares_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          favorites_count?: number
          id?: string
          likes_count?: number
          mcard_id: string
          shares_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          favorites_count?: number
          id?: string
          likes_count?: number
          mcard_id?: string
          shares_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcard_analytics_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_availability_slots: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          mcard_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          mcard_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          mcard_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_mcard_availability_slots_mcard"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_blocked_users: {
        Row: {
          blocked_at: string
          blocked_user_id: string
          created_at: string
          id: string
          mcard_id: string
        }
        Insert: {
          blocked_at?: string
          blocked_user_id: string
          created_at?: string
          id?: string
          mcard_id: string
        }
        Update: {
          blocked_at?: string
          blocked_user_id?: string
          created_at?: string
          id?: string
          mcard_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcard_blocked_users_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_customization: {
        Row: {
          animation_speed: number | null
          animation_type: string | null
          animations_enabled: boolean | null
          created_at: string
          custom_font: string | null
          gradients_enabled: boolean | null
          id: string
          mask_enabled: boolean | null
          mcard_id: string
          particles_enabled: boolean | null
          shadows_enabled: boolean | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          animation_speed?: number | null
          animation_type?: string | null
          animations_enabled?: boolean | null
          created_at?: string
          custom_font?: string | null
          gradients_enabled?: boolean | null
          id?: string
          mask_enabled?: boolean | null
          mcard_id: string
          particles_enabled?: boolean | null
          shadows_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          animation_speed?: number | null
          animation_type?: string | null
          animations_enabled?: boolean | null
          created_at?: string
          custom_font?: string | null
          gradients_enabled?: boolean | null
          id?: string
          mask_enabled?: boolean | null
          mcard_id?: string
          particles_enabled?: boolean | null
          shadows_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcard_customization_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: true
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_favorites: {
        Row: {
          created_at: string
          id: string
          mcard_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mcard_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mcard_id?: string
          user_id?: string
        }
        Relationships: []
      }
      mcard_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          mcard_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          mcard_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          mcard_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcard_interactions_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "mcard_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "mcard_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_invoices: {
        Row: {
          amount: number
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          currency: string
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string
          is_validated: boolean
          issued_date: string | null
          mcard_id: string
          notes: string | null
          paid_date: string | null
          status: string
          updated_at: string
          validated_at: string | null
        }
        Insert: {
          amount?: number
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          is_validated?: boolean
          issued_date?: string | null
          mcard_id: string
          notes?: string | null
          paid_date?: string | null
          status?: string
          updated_at?: string
          validated_at?: string | null
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          is_validated?: boolean
          issued_date?: string | null
          mcard_id?: string
          notes?: string | null
          paid_date?: string | null
          status?: string
          updated_at?: string
          validated_at?: string | null
        }
        Relationships: []
      }
      mcard_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          mcard_id: string
          message: string
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mcard_id: string
          message: string
          recipient_id: string
          sender_id: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mcard_id?: string
          message?: string
          recipient_id?: string
          sender_id?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcard_messages_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_products: {
        Row: {
          category: string
          created_at: string
          currency: string
          description: string | null
          id: string
          image_url: string | null
          image_urls: string[] | null
          is_active: boolean
          is_pinned: boolean
          mcard_id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_active?: boolean
          is_pinned?: boolean
          mcard_id: string
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[] | null
          is_active?: boolean
          is_pinned?: boolean
          mcard_id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcard_products_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_quote_items: {
        Row: {
          created_at: string
          description: string
          id: string
          quantity: number
          quote_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          quantity?: number
          quote_id: string
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          quote_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "mcard_quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "mcard_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_quotes: {
        Row: {
          amount: number
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          issued_date: string | null
          mcard_id: string
          notes: string | null
          quote_number: string
          status: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          amount?: number
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          issued_date?: string | null
          mcard_id: string
          notes?: string | null
          quote_number: string
          status?: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          issued_date?: string | null
          mcard_id?: string
          notes?: string | null
          quote_number?: string
          status?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcard_quotes_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_renewal_requests: {
        Row: {
          created_at: string
          current_plan: string
          id: string
          mcard_id: string
          processed_at: string | null
          processed_by: string | null
          requested_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_plan: string
          id?: string
          mcard_id: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_plan?: string
          id?: string
          mcard_id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mcard_reports: {
        Row: {
          created_at: string
          id: string
          mcard_id: string
          processed_at: string | null
          processed_by: string | null
          report_description: string | null
          report_reason: string
          reporter_email: string | null
          reporter_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mcard_id: string
          processed_at?: string | null
          processed_by?: string | null
          report_description?: string | null
          report_reason: string
          reporter_email?: string | null
          reporter_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mcard_id?: string
          processed_at?: string | null
          processed_by?: string | null
          report_description?: string | null
          report_reason?: string
          reporter_email?: string | null
          reporter_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcard_reports_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean
          mcard_id: string
          rating: number
          updated_at: string
          visitor_email: string | null
          visitor_name: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          mcard_id: string
          rating: number
          updated_at?: string
          visitor_email?: string | null
          visitor_name: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          mcard_id?: string
          rating?: number
          updated_at?: string
          visitor_email?: string | null
          visitor_name?: string
        }
        Relationships: []
      }
      mcard_statuses: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          mcard_id: string
          status_color: string
          status_image: string | null
          status_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          mcard_id: string
          status_color?: string
          status_image?: string | null
          status_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          mcard_id?: string
          status_color?: string
          status_image?: string | null
          status_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcard_statuses_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcard_verification_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          id_document_url: string
          mcard_id: string
          ninea_document_url: string | null
          payment_status: string | null
          processed_at: string | null
          processed_by: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          verification_fee: number | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          id_document_url: string
          mcard_id: string
          ninea_document_url?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          verification_fee?: number | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          id_document_url?: string
          mcard_id?: string
          ninea_document_url?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          verification_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mcard_verification_requests_mcard_id_fkey"
            columns: ["mcard_id"]
            isOneToOne: false
            referencedRelation: "mcards"
            referencedColumns: ["id"]
          },
        ]
      }
      mcards: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          email: string | null
          facebook_url: string | null
          full_name: string
          google_business_url: string | null
          id: string
          instagram_url: string | null
          is_published: boolean
          is_verified: boolean | null
          job_title: string | null
          linkedin_url: string | null
          maps_location_url: string | null
          phone_number: string | null
          plan: string
          profile_picture_url: string | null
          slug: string
          snapchat_url: string | null
          social_links: Json | null
          subscription_expires_at: string | null
          subscription_status: string
          telegram_url: string | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          verification_status: string | null
          view_count: number
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          full_name: string
          google_business_url?: string | null
          id?: string
          instagram_url?: string | null
          is_published?: boolean
          is_verified?: boolean | null
          job_title?: string | null
          linkedin_url?: string | null
          maps_location_url?: string | null
          phone_number?: string | null
          plan?: string
          profile_picture_url?: string | null
          slug: string
          snapchat_url?: string | null
          social_links?: Json | null
          subscription_expires_at?: string | null
          subscription_status?: string
          telegram_url?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
          view_count?: number
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          full_name?: string
          google_business_url?: string | null
          id?: string
          instagram_url?: string | null
          is_published?: boolean
          is_verified?: boolean | null
          job_title?: string | null
          linkedin_url?: string | null
          maps_location_url?: string | null
          phone_number?: string | null
          plan?: string
          profile_picture_url?: string | null
          slug?: string
          snapchat_url?: string | null
          social_links?: Json | null
          subscription_expires_at?: string | null
          subscription_status?: string
          telegram_url?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          view_count?: number
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
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
          action_url?: string | null
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
          action_url?: string | null
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
      security_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      admin_approve_mcard_renewal: {
        Args: { p_mcard_id: string; p_renewal_id: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      admin_approve_mcard_subscription: {
        Args: { p_mcard_id: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      admin_approve_mcard_verification: {
        Args: { p_request_id: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      admin_deactivate_mcard: {
        Args: { p_mcard_id: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      admin_get_all_mcards: {
        Args: never
        Returns: {
          created_at: string
          full_name: string
          id: string
          plan: string
          slug: string
          subscription_expires_at: string
          subscription_status: string
          user_email: string
          user_id: string
          user_phone: string
        }[]
      }
      admin_get_all_promo_codes: {
        Args: never
        Returns: {
          code: string
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          is_paid: boolean
          total_earnings: number
          usage_count: number
          user_email: string
          user_id: string
          user_name: string
          user_phone: string
        }[]
      }
      admin_get_all_users: {
        Args: never
        Returns: {
          country: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
        }[]
      }
      admin_get_expired_mcards: {
        Args: never
        Returns: {
          created_at: string
          days_expired: number
          full_name: string
          id: string
          plan: string
          subscription_expires_at: string
          user_email: string
          user_id: string
          user_phone: string
        }[]
      }
      admin_get_pending_mcards: {
        Args: never
        Returns: {
          created_at: string
          full_name: string
          id: string
          plan: string
          slug: string
          user_email: string
          user_id: string
          user_phone: string
        }[]
      }
      admin_get_pending_renewals: {
        Args: never
        Returns: {
          current_plan: string
          days_remaining: number
          id: string
          mcard_id: string
          mcard_name: string
          requested_at: string
          status: string
          subscription_expires_at: string
          user_email: string
          user_phone: string
        }[]
      }
      admin_send_renewal_notifications: {
        Args: never
        Returns: {
          message: string
          notifications_sent: number
          success: boolean
        }[]
      }
      can_activate_promo_codes: {
        Args: { user_email: string }
        Returns: boolean
      }
      can_add_status_today: { Args: { p_mcard_id: string }; Returns: boolean }
      count_statuses_created_today: {
        Args: { p_mcard_id: string }
        Returns: number
      }
      create_card_search_secure: {
        Args: {
          p_card_number: string
          p_searcher_email?: string
          p_searcher_phone?: string
        }
        Returns: string
      }
      create_notification_secure: {
        Args: {
          p_card_id: string
          p_message: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      deactivate_expired_promo_codes: { Args: never; Returns: undefined }
      delete_inactive_mcards: { Args: never; Returns: undefined }
      generate_invoice_number: { Args: never; Returns: string }
      generate_promo_code: { Args: never; Returns: string }
      get_audit_logs: {
        Args: never
        Returns: {
          action: string
          created_at: string
          details: Json
          id: string
          ip_address: string
          user_email: string
        }[]
      }
      get_daily_user_signups: {
        Args: never
        Returns: {
          count: number
          signup_date: string
        }[]
      }
      get_or_create_mcard_customization: {
        Args: { p_mcard_id: string }
        Returns: {
          animation_speed: number | null
          animation_type: string | null
          animations_enabled: boolean | null
          created_at: string
          custom_font: string | null
          gradients_enabled: boolean | null
          id: string
          mask_enabled: boolean | null
          mcard_id: string
          particles_enabled: boolean | null
          shadows_enabled: boolean | null
          theme: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "mcard_customization"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_public_ads: {
        Args: never
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
        SetofOptions: {
          from: "*"
          to: "admin_ads"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_public_mcard_data: {
        Args: { p_slug: string }
        Returns: {
          company: string
          created_at: string
          description: string
          email: string
          facebook_url: string
          full_name: string
          google_business_url: string
          id: string
          instagram_url: string
          is_published: boolean
          is_verified: boolean
          job_title: string
          linkedin_url: string
          maps_location_url: string
          phone_number: string
          plan: string
          profile_picture_url: string
          slug: string
          snapchat_url: string
          social_links: Json
          subscription_status: string
          telegram_url: string
          tiktok_url: string
          twitter_url: string
          user_id: string
          verification_status: string
          view_count: number
          website_url: string
          youtube_url: string
        }[]
      }
      get_public_profile_info: {
        Args: { p_user_id: string }
        Returns: {
          country: string
          first_name: string
          last_name: string
        }[]
      }
      get_public_reviews: {
        Args: { p_mcard_id: string }
        Returns: {
          comment: string
          created_at: string
          id: string
          mcard_id: string
          rating: number
          visitor_name: string
        }[]
      }
      get_safe_profile_info: {
        Args: { p_user_id: string }
        Returns: {
          country: string
          first_name: string
        }[]
      }
      increment_mcard_view_count: {
        Args: { mcard_slug: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_user_blocked: {
        Args: { p_mcard_id: string; p_user_id: string }
        Returns: boolean
      }
      log_login_event: { Args: never; Returns: undefined }
      log_security_event: {
        Args: { p_action: string; p_details?: Json; p_user_id?: string }
        Returns: undefined
      }
      notify_expired_promo_codes: { Args: never; Returns: undefined }
      send_expiring_today_notifications: {
        Args: never
        Returns: {
          message: string
          notifications_sent: number
          success: boolean
        }[]
      }
      update_expired_mcards: {
        Args: never
        Returns: {
          updated_count: number
        }[]
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
      validate_promo_code_secure: {
        Args: { code_to_validate: string }
        Returns: {
          discount_amount: number
          is_valid: boolean
          user_id: string
        }[]
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
