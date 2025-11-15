import { Database } from '@/lib/supabase/types'

type QuestionOption = Database['public']['Tables']['question_options']['Row']
type Result = Database['public']['Tables']['results']['Row']

interface ScoreMap {
  [resultId: string]: number
}

/**
 * Calculate which result the user should get based on their answers
 *
 * @param options - Array of selected question options with their points
 * @param results - Array of all possible results for the test
 * @returns The result ID with the highest score
 */
export function calculateResult(
  options: QuestionOption[],
  results: Result[]
): string {
  // Initialize score map
  const scores: ScoreMap = {}
  results.forEach((result) => {
    scores[result.id] = 0
  })

  // Accumulate points from each selected option
  options.forEach((option) => {
    const points = option.points as Record<string, number>

    Object.entries(points).forEach(([resultId, pointValue]) => {
      if (scores[resultId] !== undefined) {
        scores[resultId] += pointValue
      }
    })
  })

  // Find result with highest score
  let winningResultId = results[0].id
  let highestScore = scores[winningResultId]

  Object.entries(scores).forEach(([resultId, score]) => {
    if (score > highestScore) {
      highestScore = score
      winningResultId = resultId
    }
  })

  return winningResultId
}

/**
 * Validate that all questions have been answered
 */
export function validateAnswers(
  questionIds: string[],
  answers: Record<string, string>
): boolean {
  return questionIds.every((qId) => answers[qId] !== undefined)
}
