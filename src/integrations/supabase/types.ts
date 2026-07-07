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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      invitations: {
        Row: {
          animation_settings: Json
          created_at: string
          event_date: string
          event_name: string
          hosts: string
          id: string
          image_url: string | null
          language: string
          location: string
          message: string | null
          sections: Json
          slug: string
          subtheme: string | null
          theme: Database["public"]["Enums"]["invitation_theme"]
          updated_at: string
          user_id: string
          views_count: number
          publication_days: number | null
          published_until: string | null
        }
        Insert: {
          animation_settings?: Json
          created_at?: string
          event_date: string
          event_name: string
          hosts: string
          id?: string
          image_url?: string | null
          language?: string
          location: string
          message?: string | null
          sections?: Json
          slug?: string
          subtheme?: string | null
          theme?: Database["public"]["Enums"]["invitation_theme"]
          updated_at?: string
          user_id: string
          views_count?: number
          publication_days?: number | null
          published_until?: string | null
        }
        Update: {
          animation_settings?: Json
          created_at?: string
          event_date?: string
          event_name?: string
          hosts?: string
          id?: string
          image_url?: string | null
          language?: string
          location?: string
          message?: string | null
          sections?: Json
          slug?: string
          subtheme?: string | null
          theme?: Database["public"]["Enums"]["invitation_theme"]
          updated_at?: string
          user_id?: string
          views_count?: number
          publication_days?: number | null
          published_until?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["account_status"]
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          email: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["account_status"]
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["account_status"]
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          id: string
          key: Database["public"]["Enums"]["plan_key"]
          name: string
          max_invitations: number | null
          price_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          key: Database["public"]["Enums"]["plan_key"]
          name: string
          max_invitations?: number | null
          price_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          key?: Database["public"]["Enums"]["plan_key"]
          name?: string
          max_invitations?: number | null
          price_cents?: number
          created_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          starts_at: string
          expires_at: string
          default_publication_days: number | null
          revenue_cents: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          starts_at?: string
          expires_at: string
          default_publication_days?: number | null
          revenue_cents?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          starts_at?: string
          expires_at?: string
          default_publication_days?: number | null
          revenue_cents?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_limits: {
        Row: {
          user_id: string
          max_invitations: number | null
          updated_at: string
        }
        Insert: {
          user_id: string
          max_invitations?: number | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          max_invitations?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      invitation_views: {
        Row: {
          id: string
          invitation_id: string
          viewed_at: string
          ip_hash: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          invitation_id: string
          viewed_at?: string
          ip_hash?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          invitation_id?: string
          viewed_at?: string
          ip_hash?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      login_sessions: {
        Row: {
          id: string
          user_id: string
          logged_in_at: string
          ip_hash: string | null
        }
        Insert: {
          id?: string
          user_id: string
          logged_in_at?: string
          ip_hash?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          logged_in_at?: string
          ip_hash?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_invitation_views: {
        Args: { invitation_slug: string }
        Returns: undefined
      }
      get_public_invitation: {
        Args: { p_slug: string }
        Returns: Database["public"]["Tables"]["invitations"]["Row"][]
      }
      is_super_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      can_create_invitation: {
        Args: { p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      invitation_theme:
        | "wedding"
        | "birthday"
        | "business"
        | "minimal"
        | "graduation"
        | "luxury"
        | "tunisian"
      user_role: "super_admin" | "client"
      account_status: "active" | "suspended" | "expired"
      plan_key: "bronze" | "silver" | "gold" | "unlimited"
      subscription_status: "active" | "expired" | "suspended"
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
    Enums: {
      invitation_theme: [
        "wedding",
        "birthday",
        "business",
        "minimal",
        "graduation",
        "luxury",
        "tunisian",
      ],
    },
  },
} as const
