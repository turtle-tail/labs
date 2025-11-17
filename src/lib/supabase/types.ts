export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  labs: {
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
        Insert: Omit<Database['labs']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['labs']['Tables']['categories']['Insert']>
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
        Insert: Omit<Database['labs']['Tables']['tests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['labs']['Tables']['tests']['Insert']>
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
        Insert: Omit<Database['labs']['Tables']['questions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['questions']['Insert']>
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
        Insert: Omit<Database['labs']['Tables']['question_options']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['question_options']['Insert']>
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
          created_at: string
        }
        Insert: Omit<Database['labs']['Tables']['results']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['results']['Insert']>
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
        Insert: Omit<Database['labs']['Tables']['test_results']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['test_results']['Insert']>
      }
    }
  }
}
