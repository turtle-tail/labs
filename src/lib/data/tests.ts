import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
 * Get all published tests (for build-time)
 * Use this in generateStaticParams
 */
export async function getPublishedTestsForBuild(): Promise<Test[]> {
  const supabase = createAdminClient()

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
}

/**
 * Get all published tests (for runtime)
 * Cached for SSG
 */
export const getPublishedTests = cache(async (): Promise<Test[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('labs')
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
  // Input validation
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    console.error('Invalid slug provided')
    return null
  }

  const supabase = await createClient()

  // Get test
  const { data: test, error: testError } = await supabase
    .schema('labs')
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
    .schema('labs')
    .from('questions')
    .select(`
      *,
      options:question_options(*)
    `)
    .eq('test_id', test.id)
    .order('order_index', { ascending: true })
    .returns<(Question & { options: QuestionOption[] })[]>()

  if (questionsError) {
    console.error('Error fetching questions:', questionsError)
    return null
  }

  // Sort options by order_index (Supabase doesn't support ordering in nested queries)
  const questionsWithSortedOptions = (questions || []).map(question => ({
    ...question,
    options: (question.options || []).sort((a, b) => a.order_index - b.order_index)
  }))

  // Get results
  const { data: results, error: resultsError } = await supabase
    .schema('labs')
    .from('results')
    .select('*')
    .eq('test_id', test.id)

  if (resultsError) {
    console.error('Error fetching results:', resultsError)
    return null
  }

  return {
    ...test,
    questions: questionsWithSortedOptions,
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
    .schema('labs')
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
