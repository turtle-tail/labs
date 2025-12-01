export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Table row types
export type CategoryRow = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string
  created_at: string
  updated_at: string
}

export type TestRow = {
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

export type QuestionRow = {
  id: string
  test_id: string
  text: string
  type: 'single' | 'multiple' | 'image' | 'text'
  order_index: number
  created_at: string
}

export type QuestionOptionRow = {
  id: string
  question_id: string
  text: string
  image_url: string | null
  points: Json
  order_index: number
  created_at: string
}

export type ResultRow = {
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

export type TestResultRow = {
  id: string
  test_id: string
  result_id: string
  session_id: string | null
  answers: Json
  created_at: string
}

// Insert types
export type CategoryInsert = Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'>
export type TestInsert = Omit<TestRow, 'id' | 'created_at' | 'updated_at'>
export type QuestionInsert = Omit<QuestionRow, 'id' | 'created_at'>
export type QuestionOptionInsert = Omit<QuestionOptionRow, 'id' | 'created_at'>
export type ResultInsert = Omit<ResultRow, 'id' | 'created_at'>
export type TestResultInsert = Omit<TestResultRow, 'id' | 'created_at' | 'session_id'> & {
  session_id?: string | null
}

// Update types
export type CategoryUpdate = Partial<CategoryInsert>
export type TestUpdate = Partial<TestInsert>
export type QuestionUpdate = Partial<QuestionInsert>
export type QuestionOptionUpdate = Partial<QuestionOptionInsert>
export type ResultUpdate = Partial<ResultInsert>
export type TestResultUpdate = Partial<TestResultInsert>

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow
        Insert: CategoryInsert
        Update: CategoryUpdate
        Relationships: []
      }
      tests: {
        Row: TestRow
        Insert: TestInsert
        Update: TestUpdate
        Relationships: []
      }
      questions: {
        Row: QuestionRow
        Insert: QuestionInsert
        Update: QuestionUpdate
        Relationships: []
      }
      question_options: {
        Row: QuestionOptionRow
        Insert: QuestionOptionInsert
        Update: QuestionOptionUpdate
        Relationships: []
      }
      results: {
        Row: ResultRow
        Insert: ResultInsert
        Update: ResultUpdate
        Relationships: []
      }
      test_results: {
        Row: TestResultRow
        Insert: TestResultInsert
        Update: TestResultUpdate
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
