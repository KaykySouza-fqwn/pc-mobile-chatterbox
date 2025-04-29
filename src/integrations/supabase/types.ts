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
      characters: {
        Row: {
          character_id: number
          current_condition: string | null
          current_day: number | null
          current_location_id: number | null
          current_objective: string | null
          current_period: string | null
          current_situation: string | null
          name: string
          player_whatsapp_id: string
          section_id: number | null
          starting_conflict: string | null
          world_details: Json | null
          world_name: string | null
        }
        Insert: {
          character_id?: number
          current_condition?: string | null
          current_day?: number | null
          current_location_id?: number | null
          current_objective?: string | null
          current_period?: string | null
          current_situation?: string | null
          name: string
          player_whatsapp_id: string
          section_id?: number | null
          starting_conflict?: string | null
          world_details?: Json | null
          world_name?: string | null
        }
        Update: {
          character_id?: number
          current_condition?: string | null
          current_day?: number | null
          current_location_id?: number | null
          current_objective?: string | null
          current_period?: string | null
          current_situation?: string | null
          name?: string
          player_whatsapp_id?: string
          section_id?: number | null
          starting_conflict?: string | null
          world_details?: Json | null
          world_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_characters_section"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      factions: {
        Row: {
          description: string | null
          faction_id: number
          goal: string | null
          main_location_name: string | null
          name: string
          player_whatsapp_id: string
          religious_or_economic_ties: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          description?: string | null
          faction_id?: number
          goal?: string | null
          main_location_name?: string | null
          name: string
          player_whatsapp_id: string
          religious_or_economic_ties?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          description?: string | null
          faction_id?: number
          goal?: string | null
          main_location_name?: string | null
          name?: string
          player_whatsapp_id?: string
          religious_or_economic_ties?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          character_id: number
          description: string | null
          is_equipped: boolean | null
          item_id: number
          item_name: string
          properties: Json | null
          quantity: number | null
        }
        Insert: {
          character_id: number
          description?: string | null
          is_equipped?: boolean | null
          item_id?: number
          item_name: string
          properties?: Json | null
          quantity?: number | null
        }
        Update: {
          character_id?: number
          description?: string | null
          is_equipped?: boolean | null
          item_id?: number
          item_name?: string
          properties?: Json | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["character_id"]
          },
        ]
      }
      locations: {
        Row: {
          connection_notes: string | null
          description: string | null
          location_id: number
          name: string
          player_whatsapp_id: string
          region_name: string | null
          type: string | null
        }
        Insert: {
          connection_notes?: string | null
          description?: string | null
          location_id?: number
          name: string
          player_whatsapp_id: string
          region_name?: string | null
          type?: string | null
        }
        Update: {
          connection_notes?: string | null
          description?: string | null
          location_id?: number
          name?: string
          player_whatsapp_id?: string
          region_name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      lore_entries: {
        Row: {
          associated_location_name: string | null
          brief_summary: string | null
          lore_id: number
          name: string
          player_whatsapp_id: string
          type: string
        }
        Insert: {
          associated_location_name?: string | null
          brief_summary?: string | null
          lore_id?: number
          name: string
          player_whatsapp_id: string
          type: string
        }
        Update: {
          associated_location_name?: string | null
          brief_summary?: string | null
          lore_id?: number
          name?: string
          player_whatsapp_id?: string
          type?: string
        }
        Relationships: []
      }
      npcs: {
        Row: {
          current_location_id: number | null
          current_status: string | null
          description: string | null
          is_unique: boolean | null
          name: string
          npc_id: number
          player_whatsapp_id: string
        }
        Insert: {
          current_location_id?: number | null
          current_status?: string | null
          description?: string | null
          is_unique?: boolean | null
          name: string
          npc_id?: number
          player_whatsapp_id: string
        }
        Update: {
          current_location_id?: number | null
          current_status?: string | null
          description?: string | null
          is_unique?: boolean | null
          name?: string
          npc_id?: number
          player_whatsapp_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: number
          is_required: boolean
          order_num: number
          section_id: number
          text: string
        }
        Insert: {
          id?: number
          is_required?: boolean
          order_num: number
          section_id: number
          text: string
        }
        Update: {
          id?: number
          is_required?: boolean
          order_num?: number
          section_id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          description: string | null
          local_belief_influence: string | null
          local_economy: string | null
          location_id: number | null
          location_region: string | null
          name: string
          player_whatsapp_id: string
          relative_travel: string | null
          settlement_id: number
          type: string | null
        }
        Insert: {
          description?: string | null
          local_belief_influence?: string | null
          local_economy?: string | null
          location_id?: number | null
          location_region?: string | null
          name: string
          player_whatsapp_id: string
          relative_travel?: string | null
          settlement_id?: number
          type?: string | null
        }
        Update: {
          description?: string | null
          local_belief_influence?: string | null
          local_economy?: string | null
          location_id?: number | null
          location_region?: string | null
          name?: string
          player_whatsapp_id?: string
          relative_travel?: string | null
          settlement_id?: number
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
