import { Database } from '@/lib/supabase/types';
import { parsePoints, PointsMap } from '@/lib/types/database';

type QuestionOption = Database['labs']['Tables']['question_options']['Row'];
type Result = Database['labs']['Tables']['results']['Row'];

interface ScoreMap {
  [resultId: string]: number;
}

/**
 * Calculate which result the user should get based on their answers
 *
 * @param options - Array of selected question options with their points
 * @param results - Array of all possible results for the test
 * @returns The result ID with the highest score
 * @throws Error if any option has invalid points data
 */
export function calculateResult(options: QuestionOption[], results: Result[]): string {
  if (results.length === 0) {
    throw new Error('No results available for scoring');
  }

  if (options.length === 0) {
    throw new Error('No options provided for calculation');
  }

  // Initialize score map
  const scores: ScoreMap = {};
  results.forEach((result) => {
    scores[result.id] = 0;
  });

  // Accumulate points from each selected option
  options.forEach((option, index) => {
    let points: PointsMap;

    try {
      points = parsePoints(option.points);
    } catch (error) {
      throw new Error(`Invalid points data for option at index ${index}: ${(error as Error).message}`);
    }

    Object.entries(points).forEach(([resultId, pointValue]) => {
      if (scores[resultId] !== undefined) {
        scores[resultId] += pointValue;
      }
    });
  });

  // Find result with highest score
  let winningResultId = results[0].id;
  let highestScore = scores[winningResultId];

  Object.entries(scores).forEach(([resultId, score]) => {
    if (score > highestScore) {
      highestScore = score;
      winningResultId = resultId;
    }
  });

  return winningResultId;
}

/**
 * Validate that all questions have been answered
 * @param totalQuestions - Total number of questions in the test
 * @param answers - User answers with 1-based question numbers
 */
export function validateAnswers(totalQuestions: number, answers: Record<number, number>): boolean {
  // Check that all questions (1 to totalQuestions) have answers
  for (let i = 1; i <= totalQuestions; i++) {
    if (answers[i] === undefined) {
      return false;
    }
  }
  return true;
}
