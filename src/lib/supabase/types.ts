export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tests: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          description: string | null
          thumbnail: string | null
          estimated_time: number
          question_count: number
          is_published: boolean
          share_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          slug: string
          description?: string | null
          thumbnail?: string | null
          estimated_time: number
          question_count: number
          is_published: boolean
          share_text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          slug?: string
          description?: string | null
          thumbnail?: string | null
          estimated_time?: number
          question_count?: number
          is_published?: boolean
          share_text?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          test_id: string
          text: string
          type: 'single' | 'multiple' | 'image' | 'text'
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          text: string
          type: 'single' | 'multiple' | 'image' | 'text'
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          text?: string
          type?: 'single' | 'multiple' | 'image' | 'text'
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          id: string
          question_id: string
          text: string
          image_url: string | null
          points: Json
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          text: string
          image_url?: string | null
          points: Json
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          text?: string
          image_url?: string | null
          points?: Json
          order_index?: number
          created_at?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          id: string
          test_id: string
          title: string
          keywords: string[]
          description: string | null
          image_url: string | null
          share_description: string
          this_year_description: string | null
          next_year_advice: string | null
          score_key: string | null
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          title: string
          keywords: string[]
          description?: string | null
          image_url?: string | null
          share_description: string
          this_year_description?: string | null
          next_year_advice?: string | null
          score_key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          title?: string
          keywords?: string[]
          description?: string | null
          image_url?: string | null
          share_description?: string
          this_year_description?: string | null
          next_year_advice?: string | null
          score_key?: string | null
          created_at?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          id: string
          test_id: string
          result_id: string
          session_id: string | null
          answers: Json
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          result_id: string
          session_id?: string | null
          answers: Json
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          result_id?: string
          session_id?: string | null
          answers?: Json
          created_at?: string
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
