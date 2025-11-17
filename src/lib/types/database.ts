/**
 * Type definitions for JSON columns in the database
 * These provide type safety for JSONB columns that would otherwise be 'any'
 */

/**
 * Points map for question options
 * Maps result IDs to point values
 *
 * @example
 * {
 *   "result-uuid-1": 10,
 *   "result-uuid-2": 5
 * }
 */
export interface PointsMap {
  [resultId: string]: number;
}

/**
 * Test answers submitted by users
 * Maps question numbers (1-based) to selected option numbers (1-based)
 *
 * @example
 * {
 *   1: 2,  // Question 1, Option 2
 *   2: 1,  // Question 2, Option 1
 *   3: 4   // Question 3, Option 4
 * }
 */
export interface TestAnswers {
  [questionNumber: number]: number;
}

/**
 * Type guard to check if value is a valid PointsMap
 */
export function isPointsMap(value: unknown): value is PointsMap {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Object.entries(value).every(([key, val]) => typeof key === 'string' && typeof val === 'number');
}

/**
 * Type guard to check if value is a valid TestAnswers
 */
export function isTestAnswers(value: unknown): value is TestAnswers {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Object.entries(value).every(([key, val]) => !isNaN(Number(key)) && typeof val === 'number');
}

/**
 * Safely parse points from database JSON column
 * @throws Error if points are invalid
 */
export function parsePoints(points: unknown): PointsMap {
  if (!isPointsMap(points)) {
    throw new Error('Invalid points data structure');
  }
  return points;
}

/**
 * Safely parse answers from database JSON column
 * @throws Error if answers are invalid
 */
export function parseAnswers(answers: unknown): TestAnswers {
  if (!isTestAnswers(answers)) {
    throw new Error('Invalid answers data structure');
  }
  return answers;
}
