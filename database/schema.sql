-- Labs Viral Quiz Platform - Database Schema
-- PostgreSQL schema for Supabase
-- Created: 2025-11-14

-- Create schema for labs
CREATE SCHEMA IF NOT EXISTS labs;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table (for organizing tests)
CREATE TABLE IF NOT EXISTS labs.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji or icon identifier
  color TEXT NOT NULL DEFAULT '#00A67E',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tests table (main test content)
CREATE TABLE IF NOT EXISTS labs.tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES labs.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail TEXT, -- URL for Open Graph image
  estimated_time INTEGER NOT NULL DEFAULT 2, -- in minutes
  question_count INTEGER NOT NULL DEFAULT 10,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  share_text TEXT NOT NULL DEFAULT '재미있는 심리테스트를 풀어보세요!',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questions table (belongs to a test)
CREATE TABLE IF NOT EXISTS labs.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES labs.tests(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'single' CHECK (type IN ('single', 'multiple', 'image', 'text')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (test_id, order_index)
);

-- Question options (multiple choice answers)
CREATE TABLE IF NOT EXISTS labs.question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES labs.questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT, -- optional image for visual options
  points JSONB NOT NULL DEFAULT '{}', -- {"result_uuid": score, ...}
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (question_id, order_index)
);

-- Results table (possible outcomes for a test)
CREATE TABLE IF NOT EXISTS labs.results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES labs.tests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  image_url TEXT, -- colorful result image
  share_description TEXT NOT NULL, -- text shown when sharing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Test results (user completions)
CREATE TABLE IF NOT EXISTS labs.test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES labs.tests(id) ON DELETE CASCADE,
  result_id UUID NOT NULL REFERENCES labs.results(id) ON DELETE CASCADE,
  session_id TEXT, -- optional tracking (can be null for anonymous)
  answers JSONB NOT NULL DEFAULT '{}', -- {"question_id": "option_id", ...}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tests_published ON labs.tests(is_published);
CREATE INDEX IF NOT EXISTS idx_tests_slug ON labs.tests(slug);
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON labs.questions(test_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON labs.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_results_test_id ON labs.results(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON labs.test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON labs.test_results(created_at);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION labs.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to tests table
DROP TRIGGER IF EXISTS update_tests_updated_at ON labs.tests;
CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON labs.tests
  FOR EACH ROW
  EXECUTE FUNCTION labs.update_updated_at_column();

-- Add trigger to categories table
DROP TRIGGER IF EXISTS update_categories_updated_at ON labs.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON labs.categories
  FOR EACH ROW
  EXECUTE FUNCTION labs.update_updated_at_column();

-- Comments for documentation
COMMENT ON SCHEMA labs IS 'Schema for Labs viral quiz platform';
COMMENT ON TABLE labs.categories IS 'Test categories for organizing quizzes';
COMMENT ON TABLE labs.tests IS 'Main test/quiz content';
COMMENT ON TABLE labs.questions IS 'Questions belonging to a test';
COMMENT ON TABLE labs.question_options IS 'Multiple choice options for questions';
COMMENT ON TABLE labs.results IS 'Possible result outcomes for a test';
COMMENT ON TABLE labs.test_results IS 'User test completions (anonymous)';
