import { Database } from '@/lib/supabase/types';
import { parsePoints, PointsMap } from '@/lib/types/database';

type QuestionOption = Database['public']['Tables']['question_options']['Row'];
type Result = Database['public']['Tables']['results']['Row'];

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

  // Initialize score map using score_key
  const scores: ScoreMap = {};
  const scoreKeyToId: Record<string, string> = {};

  results.forEach((result) => {
    if (result.score_key) {
      scores[result.score_key] = 0;
      scoreKeyToId[result.score_key] = result.id;
    }
  });

  console.log('Score keys:', Object.keys(scores));

  // Accumulate points from each selected option
  options.forEach((option, index) => {
    let points: PointsMap;

    try {
      points = parsePoints(option.points);
    } catch (error) {
      throw new Error(`Invalid points data for option at index ${index}: ${(error as Error).message}`);
    }

    console.log(`Option ${index + 1} points:`, points);

    Object.entries(points).forEach(([scoreKey, pointValue]) => {
      if (scores[scoreKey] !== undefined) {
        scores[scoreKey] += pointValue;
      }
    });
  });

  console.log('Final scores:', scores);

  // Find score_key with highest score
  let winningScoreKey = Object.keys(scores)[0];
  let highestScore = scores[winningScoreKey];

  Object.entries(scores).forEach(([scoreKey, score]) => {
    if (score > highestScore) {
      highestScore = score;
      winningScoreKey = scoreKey;
    }
  });

  console.log('Winning score key:', winningScoreKey, 'with score:', highestScore);

  // Return the actual result ID
  return scoreKeyToId[winningScoreKey];
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
