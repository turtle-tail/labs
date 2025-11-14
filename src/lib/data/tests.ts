import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'
import { cache } from 'react'

type Test = Database['labs']['Tables']['tests']['Row']
type Question = Database['labs']['Tables']['questions']['Row']
type QuestionOption = Database['labs']['Tables']['question_options']['Row']
type Result = Database['labs']['Tables']['results']['Row']

export interface TestWithQuestions extends Test {
  questions: (Question & {
    options: QuestionOption[]
  })[]
  results: Result[]
}

/**
 * Get all published tests
 * Cached for SSG
 */
export const getPublishedTests = cache(async (): Promise<Test[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tests:', error)
    return []
  }

  return data || []
})

/**
 * Get test by slug with all questions, options, and results
 * Cached for SSG
 */
export const getTestBySlug = cache(async (slug: string): Promise<TestWithQuestions | null> => {
  const supabase = await createClient()

  // Get test
  const { data: test, error: testError } = await supabase
    .from('tests')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (testError || !test) {
    return null
  }

  // Get questions with options
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select(`
      *,
      options:question_options(*)
    `)
    .eq('test_id', test.id)
    .order('order_index', { ascending: true })

  if (questionsError) {
    console.error('Error fetching questions:', questionsError)
    return null
  }

  // Get results
  const { data: results, error: resultsError } = await supabase
    .from('results')
    .select('*')
    .eq('test_id', test.id)

  if (resultsError) {
    console.error('Error fetching results:', resultsError)
    return null
  }

  return {
    ...test,
    questions: questions || [],
    results: results || [],
  }
})

/**
 * Get test result by ID
 * For result page (ISR)
 */
export const getTestResult = cache(async (resultId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('test_results')
    .select(`
      *,
      test:tests(*),
      result:results(*)
    `)
    .eq('id', resultId)
    .single()

  if (error) {
    console.error('Error fetching result:', error)
    return null
  }

  return data
})
