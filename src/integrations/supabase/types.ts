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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string
          is_enabled: boolean
          position: string
          redirect_link: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_enabled?: boolean
          position?: string
          redirect_link?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_enabled?: boolean
          position?: string
          redirect_link?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      article_images: {
        Row: {
          article_id: string
          caption: string | null
          caption_en: string | null
          created_at: string
          id: string
          image_url: string
          is_cover: boolean
          sort_order: number
        }
        Insert: {
          article_id: string
          caption?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_cover?: boolean
          sort_order?: number
        }
        Update: {
          article_id?: string
          caption?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_cover?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_submissions: {
        Row: {
          article_title: string
          category_id: string | null
          content: string
          created_at: string
          email: string
          id: string
          image_url: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          article_title: string
          category_id?: string | null
          content: string
          created_at?: string
          email: string
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          article_title?: string
          category_id?: string | null
          content?: string
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_submissions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          article_type: string
          author_name: string | null
          author_photo_url: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          description_en: string | null
          home_position: string
          id: string
          is_breaking: boolean
          is_featured: boolean
          is_main: boolean
          is_popular: boolean
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          title_en: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          article_type?: string
          author_name?: string | null
          author_photo_url?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          home_position?: string
          id?: string
          is_breaking?: boolean
          is_featured?: boolean
          is_main?: boolean
          is_popular?: boolean
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          article_type?: string
          author_name?: string | null
          author_photo_url?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          home_position?: string
          id?: string
          is_breaking?: boolean
          is_featured?: boolean
          is_main?: boolean
          is_popular?: boolean
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          album: string | null
          caption: string | null
          caption_en: string | null
          created_at: string
          created_by: string | null
          id: string
          image_url: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          album?: string | null
          caption?: string | null
          caption_en?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_url: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          album?: string | null
          caption?: string | null
          caption_en?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_post_images: {
        Row: {
          caption: string | null
          caption_en: string | null
          created_at: string
          id: string
          image_url: string
          post_id: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          image_url: string
          post_id: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          image_url?: string
          post_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_post_images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "gallery_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_posts: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          sort_order: number | null
          title: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          sort_order?: number | null
          title?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          sort_order?: number | null
          title?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          apply_link: string | null
          company_name: string
          company_name_en: string | null
          created_at: string
          created_by: string | null
          description: string | null
          description_en: string | null
          id: string
          job_type: string | null
          last_date: string | null
          location: string | null
          location_en: string | null
          qualification: string | null
          qualification_en: string | null
          salary: string | null
          salary_en: string | null
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          apply_link?: string | null
          company_name?: string
          company_name_en?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          id?: string
          job_type?: string | null
          last_date?: string | null
          location?: string | null
          location_en?: string | null
          qualification?: string | null
          qualification_en?: string | null
          salary?: string | null
          salary_en?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          apply_link?: string | null
          company_name?: string
          company_name_en?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          id?: string
          job_type?: string | null
          last_date?: string | null
          location?: string | null
          location_en?: string | null
          qualification?: string | null
          qualification_en?: string | null
          salary?: string | null
          salary_en?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      password_reset_otps: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          used?: boolean
        }
        Relationships: []
      }
      quotes: {
        Row: {
          author: string
          created_at: string
          created_by: string | null
          id: string
          quote_text: string
          updated_at: string
        }
        Insert: {
          author?: string
          created_at?: string
          created_by?: string | null
          id?: string
          quote_text: string
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          created_by?: string | null
          id?: string
          quote_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_number: string | null
          email: string | null
          facebook_link: string | null
          id: string
          instagram_link: string | null
          show_login_button: boolean
          updated_at: string
          website_logo_url: string | null
          whatsapp_group_link: string | null
          youtube_link: string | null
        }
        Insert: {
          contact_number?: string | null
          email?: string | null
          facebook_link?: string | null
          id?: string
          instagram_link?: string | null
          show_login_button?: boolean
          updated_at?: string
          website_logo_url?: string | null
          whatsapp_group_link?: string | null
          youtube_link?: string | null
        }
        Update: {
          contact_number?: string | null
          email?: string | null
          facebook_link?: string | null
          id?: string
          instagram_link?: string | null
          show_login_button?: boolean
          updated_at?: string
          website_logo_url?: string | null
          whatsapp_group_link?: string | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_type: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_type?: string
          youtube_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_type?: string
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
