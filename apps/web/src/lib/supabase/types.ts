export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      menus: {
        Row: {
          id: string
          parent_id: string | null
          title: string
          path: string | null
          icon: string | null
          sort: number
          roles: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['menus']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menus']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
    }
  }
}

export type Menu = Database['public']['Tables']['menus']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
