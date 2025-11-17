'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateResult, validateAnswers } from '@/lib/utils/calculate-result'
import { Database } from '@/lib/supabase/types'

type Question = { id: string; order_index: number }
type QuestionOption = Database['labs']['Tables']['question_options']['Row']
type Result = Database['labs']['Tables']['results']['Row']
type TestResult = { id: string }

export async function submitTest(
  testId: string,
  answers: Record<number, number>
) {
  const supabase = await createClient()
  // 1. Get all questions with their IDs
  const { data: questions, error: questionsError } = await supabase
    .schema('labs')
    .from('questions')
    .select('id, order_index')
    .eq('test_id', testId)
    .order('order_index')
    .returns<Question[]>()
  if (questionsError || !questions) {
    throw new Error('Failed to load questions')
  }
  // 2. Validate all questions are answered (1-based indices)
  const totalQuestions = questions.length
  if (!validateAnswers(totalQuestions, answers)) {
    throw new Error('Not all questions have been answered')
  }
  // 3. Get selected options with their points based on order_index
  const selectedOptions = []
  for (let i = 0; i < questions.length; i++) {
    const questionNumber = i + 1
    const optionNumber = answers[questionNumber]
    const question = questions[i]

    const { data: option, error: optionError } = await supabase
      .schema('labs')
      .from('question_options')
      .select('*')
      .eq('question_id', question.id)
      .eq('order_index', optionNumber)
      .single<QuestionOption>()

    if (optionError || !option) {
      throw new Error(`Failed to load option for question ${questionNumber}`)
    }

    selectedOptions.push(option)
  }
  // 4. Get all possible results
  const { data: results, error: resultsError } = await supabase
    .schema('labs')
    .from('results')
    .select('*')
    .eq('test_id', testId)
    .returns<Result[]>()
  if (resultsError || !results || results.length === 0) {
    throw new Error('No results found for this test')
  }
  // 5. Calculate winning result
  const winningResultId = calculateResult(selectedOptions, results)

  // 6. Save to test_results table
  const { data: testResult, error } = await supabase
    .schema('labs')
    .from('test_results')
    .insert({
      test_id: testId,
      result_id: winningResultId,
      answers: answers as Record<string, number>,
    })
    .select('id')
    .single<TestResult>()

  if (error || !testResult) {
    throw new Error(`Failed to save test result: ${error?.message || 'Unknown error'}`)
  }
  // 7. Redirect to result page
  redirect(`/results/${testResult.id}`)
}
