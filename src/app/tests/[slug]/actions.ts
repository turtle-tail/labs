'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { calculateResult, validateAnswers } from '@/lib/utils/calculate-result';
import { Database } from '@/lib/supabase/types';
import { TestAnswers } from '@/lib/types/database';

type Question = { id: string; order_index: number };
type QuestionOption = Database['labs']['Tables']['question_options']['Row'];
type Result = Database['labs']['Tables']['results']['Row'];
type TestResult = { id: string };

/**
 * Submit test answers and calculate result
 *
 * @param testId - UUID of the test
 * @param answers - User answers mapping question number to option number (1-based)
 * @throws Error if validation fails or database operation fails
 */

export async function submitTest(testId: string, answers: TestAnswers): Promise<never> {
  const supabase = await createClient();
  // 1. Get all questions with their IDs
  const { data: questions, error: questionsError } = await supabase
    .schema('labs')
    .from('questions')
    .select('id, order_index')
    .eq('test_id', testId)
    .order('order_index')
    .returns<Question[]>();
  if (questionsError || !questions) {
    throw new Error('Failed to load questions');
  }
  // 2. Validate all questions are answered (1-based indices)
  const totalQuestions = questions.length;
  if (!validateAnswers(totalQuestions, answers)) {
    throw new Error('Not all questions have been answered');
  }
  // 3. Get all options for these questions in a single query
  const questionIds = questions.map((q) => q.id);
  const { data: allOptions, error: optionsError } = await supabase
    .schema('labs')
    .from('question_options')
    .select('*')
    .in('question_id', questionIds)
    .returns<QuestionOption[]>();

  if (optionsError || !allOptions) {
    throw new Error('Failed to load options');
  }

  // 4. Find the selected option for each question
  const selectedOptions: QuestionOption[] = [];
  for (let i = 0; i < questions.length; i++) {
    const questionNumber = i + 1;
    const optionNumber = answers[questionNumber];
    const question = questions[i];

    const option = allOptions.find((opt) => opt.question_id === question.id && opt.order_index === optionNumber);

    if (!option) {
      throw new Error(`Failed to find option for question ${questionNumber}`);
    }

    selectedOptions.push(option);
  }
  // 5. Get all possible results
  const { data: results, error: resultsError } = await supabase
    .schema('labs')
    .from('results')
    .select('*')
    .eq('test_id', testId)
    .returns<Result[]>();
  if (resultsError || !results || results.length === 0) {
    throw new Error('No results found for this test');
  }
  // 6. Calculate winning result
  const winningResultId = calculateResult(selectedOptions, results);

  // 7. Save to test_results table
  const { data: testResult, error } = await supabase
    .schema('labs')
    .from('test_results')
    .insert({
      test_id: testId,
      result_id: winningResultId,
      answers: answers,
    })
    .select('id')
    .single<TestResult>();

  if (error || !testResult) {
    throw new Error(`Failed to save test result: ${error?.message || 'Unknown error'}`);
  }
  // 8. Redirect to result page
  redirect(`/results/${testResult.id}`);
}
