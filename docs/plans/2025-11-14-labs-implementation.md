# Labs Viral Quiz Platform - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a viral psychological test platform where users can take anonymous quizzes, get personalized results, and share via unique URLs.

**Architecture:** Next.js 15 with SSG for test pages, ISR for results, Supabase PostgreSQL for data storage, admin dashboard with password auth, git-triggered auto-deployment to DigitalOcean.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Supabase, PostgreSQL

**Design Reference:** `docs/plans/2025-11-14-labs-viral-quiz-platform-design.md`

---

## Phase 1: Core Infrastructure Setup

### Task 1: Database Schema & Supabase Setup

**Files:**
- Modify: `database/schema.sql`
- Create: `.env.local`

**Step 1: Review existing schema**

Read: `database/schema.sql`
Verify: Tables match design (categories, tests, questions, question_options, results, test_results)

**Step 2: Update schema to remove unnecessary field**

Remove `result_criteria` field from `results` table (not needed for our calculation approach):

```sql
-- In database/schema.sql, line 68
-- REMOVE this line:
result_criteria JSONB DEFAULT '{}',
```

**Step 3: Create environment variables file**

Create: `.env.local`

```env
# Supabase
SUPABASE_URL=https://zyufulmvzibslctvczpe.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Admin
ADMIN_PASSWORD=change-this-in-production

# Analytics (will be added later)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_CLARITY_ID=
```

**Step 4: Add .env.local to .gitignore**

Verify `.env.local` is in `.gitignore` (should already be there by default)

**Step 5: Apply migration to Supabase**

Using Supabase MCP server:
1. Open Claude Code
2. Run `/mcp` if not authenticated
3. Use Supabase MCP tools to apply migration

Alternative: Use Supabase dashboard SQL editor to run `database/schema.sql`

**Step 6: Verify tables created**

Query to verify:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'labs'
ORDER BY table_name;
```

Expected: 6 tables (categories, question_options, questions, results, test_results, tests)

**Step 7: Commit**

```bash
git add database/schema.sql .env.local .gitignore
git commit -m "feat: update database schema and add env config

- Remove unused result_criteria field
- Add environment variables template
- Prepare for Supabase integration"
```

---

### Task 2: Supabase Client Configuration

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/types.ts`

**Step 1: Install Supabase packages (already done)**

Verify: `package.json` has `@supabase/supabase-js`

**Step 2: Create browser client**

Create: `src/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 3: Create server client**

Create: `src/lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component, ignore
          }
        },
      },
    }
  )
}
```

**Step 4: Create TypeScript types**

Create: `src/lib/supabase/types.ts`

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  labs: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['labs']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['labs']['Tables']['categories']['Insert']>
      }
      tests: {
        Row: {
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
        Insert: Omit<Database['labs']['Tables']['tests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['labs']['Tables']['tests']['Insert']>
      }
      questions: {
        Row: {
          id: string
          test_id: string
          text: string
          type: 'single' | 'multiple' | 'image' | 'text'
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['labs']['Tables']['questions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['questions']['Insert']>
      }
      question_options: {
        Row: {
          id: string
          question_id: string
          text: string
          image_url: string | null
          points: Json
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['labs']['Tables']['question_options']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['question_options']['Insert']>
      }
      results: {
        Row: {
          id: string
          test_id: string
          title: string
          keywords: string[]
          description: string | null
          image_url: string | null
          share_description: string
          created_at: string
        }
        Insert: Omit<Database['labs']['Tables']['results']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['results']['Insert']>
      }
      test_results: {
        Row: {
          id: string
          test_id: string
          result_id: string
          session_id: string | null
          answers: Json
          created_at: string
        }
        Insert: Omit<Database['labs']['Tables']['test_results']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['labs']['Tables']['test_results']['Insert']>
      }
    }
  }
}
```

**Step 5: Update environment variables for Next.js**

Modify: `.env.local`

Add `NEXT_PUBLIC_` prefix for client-side access:

```env
# Supabase (client + server)
NEXT_PUBLIC_SUPABASE_URL=https://zyufulmvzibslctvczpe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin (server only)
ADMIN_PASSWORD=change-this-in-production
```

**Step 6: Commit**

```bash
git add src/lib/supabase/ .env.local
git commit -m "feat: add Supabase client configuration

- Create browser and server clients
- Add TypeScript types for database schema
- Configure environment variables"
```

---

### Task 3: Design System - Tailwind Configuration

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/app/fonts.ts`

**Step 1: Add Pretendard font**

Create: `src/app/fonts.ts`

```typescript
import localFont from 'next/font/local'

export const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
})
```

**Step 2: Update globals.css with design system**

Modify: `src/app/globals.css`

Replace existing content with:

```css
@import "tailwindcss";

:root {
  /* Colors */
  --color-primary: #00a67e;
  --color-primary-hover: #008f6d;

  --color-bg-main: #fafafa;
  --color-bg-card: #ffffff;
  --color-bg-secondary: #f5f5f5;

  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;

  --color-border: #e0e0e0;
  --color-border-active: var(--color-primary);

  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: var(--color-bg-main);
  color: var(--color-text-primary);
}

body {
  font-family: var(--font-pretendard), -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 3: Extend Tailwind config**

Modify: `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        bg: {
          main: 'var(--color-bg-main)',
          card: 'var(--color-bg-card)',
          secondary: 'var(--color-bg-secondary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          active: 'var(--color-border-active)',
        },
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      maxWidth: {
        'content': '640px',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**Step 4: Update root layout**

Modify: `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { pretendard } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Labs - 심리테스트",
  description: "재미있는 심리테스트를 풀고 친구들과 공유해보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Step 5: Download Pretendard fonts**

Note: Fonts need to be downloaded. For now, skip font file download and use system fonts as fallback.

Update: `src/app/fonts.ts`

```typescript
// Using system fonts as fallback until Pretendard is downloaded
export const pretendard = {
  variable: '--font-pretendard',
  style: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
}
```

**Step 6: Commit**

```bash
git add src/app/globals.css src/app/fonts.ts src/app/layout.tsx tailwind.config.ts
git commit -m "feat: add design system with Tailwind config

- Define color palette, spacing, and border radius variables
- Configure Tailwind with design tokens
- Prepare font loading (using system fonts temporarily)
- Update root layout with Korean language"
```

---

### Task 4: Reusable UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/ProgressBar.tsx`
- Create: `src/components/ui/Tag.tsx`

**Step 1: Create Button component**

Create: `src/components/ui/Button.tsx`

```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export function Button({
  variant = 'primary',
  children,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
          'bg-white text-text-primary border border-border hover:border-text-secondary':
            variant === 'secondary',
        },
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  )
}
```

**Step 2: Create Card component**

Create: `src/components/ui/Card.tsx`

```typescript
import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-border rounded-lg p-4',
        {
          'transition-all hover:border-primary hover:shadow-sm cursor-pointer': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

**Step 3: Create ProgressBar component**

Create: `src/components/ui/ProgressBar.tsx`

```typescript
interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <p className="text-sm text-text-tertiary text-center mb-2">
        Step {current} of {total}
      </p>
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

**Step 4: Create Tag component**

Create: `src/components/ui/Tag.tsx`

```typescript
interface TagProps {
  children: string
}

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-block px-4 py-1.5 text-sm text-primary border border-primary rounded-full">
      {children}
    </span>
  )
}
```

**Step 5: Install clsx for className utilities**

Run:
```bash
npm install clsx
```

**Step 6: Commit**

```bash
git add src/components/ui/ package.json package-lock.json
git commit -m "feat: add reusable UI components

- Create Button with primary/secondary variants
- Create Card with optional hover effect
- Create ProgressBar for test progression
- Create Tag for keyword display
- Add clsx for conditional classNames"
```

---

## Phase 2: Test Flow Implementation

### Task 5: Home Page (Placeholder)

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Create simple home page placeholder**

Modify: `src/app/page.tsx`

```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-content w-full text-center">
        <div className="mb-6 text-6xl">✨</div>
        <h1 className="text-3xl font-bold mb-4">Labs</h1>
        <p className="text-text-secondary mb-8">
          재미있는 심리테스트 플랫폼
        </p>
        <Link href="/tests/2025-keyword-check">
          <Button>첫 번째 테스트 시작하기</Button>
        </Link>
      </div>
    </main>
  )
}
```

**Step 2: Test locally**

Run:
```bash
npm run dev
```

Visit: http://localhost:3000
Expected: Home page with button

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add home page placeholder

- Simple centered layout with CTA
- Links to first test (to be created)"
```

---

### Task 6: Test Data Fetching Utilities

**Files:**
- Create: `src/lib/data/tests.ts`

**Step 1: Create test data fetching functions**

Create: `src/lib/data/tests.ts`

```typescript
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
```

**Step 2: Commit**

```bash
git add src/lib/data/tests.ts
git commit -m "feat: add test data fetching utilities

- Create cached functions for SSG
- Get published tests
- Get test by slug with questions and options
- Get test result by ID for result page"
```

---

### Task 7: Test Detail Page (SSG)

**Files:**
- Create: `src/app/tests/[slug]/page.tsx`
- Create: `src/components/test/TestIntro.tsx`

**Step 1: Create test intro component**

Create: `src/components/test/TestIntro.tsx`

```typescript
'use client'

import { Button } from '@/components/ui/Button'

interface TestIntroProps {
  title: string
  description: string | null
  questionCount: number
  estimatedTime: number
  onStart: () => void
}

export function TestIntro({
  title,
  description,
  questionCount,
  estimatedTime,
  onStart,
}: TestIntroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-content w-full text-center">
        {/* Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-3xl">
          <span className="text-4xl">✨</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">{title}</h1>

        {/* Description */}
        {description && (
          <div className="space-y-2 mb-8">
            {description.split('\n').map((line, i) => (
              <p key={i} className="text-text-secondary">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* CTA */}
        <Button onClick={onStart} className="mb-6">
          시작하기
        </Button>

        {/* Meta info */}
        <p className="text-sm text-text-tertiary">
          {questionCount}개의 질문 • 약 {estimatedTime}분 소요
        </p>
      </div>
    </div>
  )
}
```

**Step 2: Create test page**

Create: `src/app/tests/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation'
import { getTestBySlug, getPublishedTests } from '@/lib/data/tests'
import { TestContainer } from './TestContainer'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all published tests
export async function generateStaticParams() {
  const tests = await getPublishedTests()
  return tests.map((test) => ({
    slug: test.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const test = await getTestBySlug(slug)

  if (!test) {
    return {
      title: 'Test Not Found',
    }
  }

  return {
    title: test.title,
    description: test.description,
    openGraph: {
      title: test.title,
      description: test.description || undefined,
      images: test.thumbnail ? [{ url: test.thumbnail }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: test.title,
      description: test.description || undefined,
      images: test.thumbnail ? [test.thumbnail] : [],
    },
  }
}

export default async function TestPage({ params }: PageProps) {
  const { slug } = await params
  const test = await getTestBySlug(slug)

  if (!test) {
    notFound()
  }

  return <TestContainer test={test} />
}
```

**Step 3: Create test container (client component)**

Create: `src/app/tests/[slug]/TestContainer.tsx`

```typescript
'use client'

import { useState } from 'react'
import { TestIntro } from '@/components/test/TestIntro'
import { TestWithQuestions } from '@/lib/data/tests'

interface TestContainerProps {
  test: TestWithQuestions
}

export function TestContainer({ test }: TestContainerProps) {
  const [started, setStarted] = useState(false)

  if (!started) {
    return (
      <TestIntro
        title={test.title}
        description={test.description}
        questionCount={test.question_count}
        estimatedTime={test.estimated_time}
        onStart={() => setStarted(true)}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-content w-full text-center">
        <p>Question flow will be implemented next</p>
      </div>
    </div>
  )
}
```

**Step 4: Test locally**

Run:
```bash
npm run dev
```

Note: This will fail because there's no test data yet. We'll add seed data in the next task.

**Step 5: Commit**

```bash
git add src/app/tests/ src/components/test/
git commit -m "feat: add test detail page with SSG

- Create test intro component with start button
- Generate static params for all published tests
- Add Open Graph metadata for sharing
- Set up client-side state for test flow"
```

---

### Task 8: Seed Test Data

**Files:**
- Create: `scripts/seed-test-data.sql`

**Step 1: Create seed data script**

Create: `scripts/seed-test-data.sql`

```sql
-- Seed data for "2025 나의 키워드 3개 찾기" test
-- Based on Figma design

-- Insert test
INSERT INTO labs.tests (
  id,
  title,
  slug,
  description,
  question_count,
  estimated_time,
  is_published,
  share_text
) VALUES (
  gen_random_uuid(),
  '2025 나의 키워드 3개 찾기',
  '2025-keyword-check',
  E'2025년의 나는 어떤 모습이었을까?\n올해의 당신을 가장 잘 설명하는 선택지를 골라보세요.',
  10,
  2,
  true,
  '나의 2025 키워드를 확인해보세요!'
);

-- Get test ID for foreign keys
DO $$
DECLARE
  test_id uuid;

  -- Question IDs
  q1_id uuid;
  q2_id uuid;
  q3_id uuid;

  -- Result IDs
  result_multi_id uuid;
  result_focused_id uuid;
  result_explorer_id uuid;
  result_healing_id uuid;
BEGIN
  -- Get test ID
  SELECT id INTO test_id FROM labs.tests WHERE slug = '2025-keyword-check';

  -- Create result IDs
  result_multi_id := gen_random_uuid();
  result_focused_id := gen_random_uuid();
  result_explorer_id := gen_random_uuid();
  result_healing_id := gen_random_uuid();

  -- Insert results
  INSERT INTO labs.results (id, test_id, title, keywords, description, share_description) VALUES
  (result_multi_id, test_id, '나만의 페이스로 산 한 해 🎭',
   ARRAY['집중', '성장', '안정'],
   '2025년, 당신은 여러 가지를 다 경험했어요. 기쁨도, 슬픔도, 혼란도, 성장도 다 있었죠. 어떤 하나로 정의되지 않는 게 오히려 당신다운 거 아닐까요? 멀티 플레이어 인정합니다 ✌️',
   '나는 멀티 플레이어! 나만의 페이스로 산 한 해였어요 🎭');

  -- Insert questions
  -- Q1
  q1_id := gen_random_uuid();
  INSERT INTO labs.questions (id, test_id, text, type, order_index) VALUES
  (q1_id, test_id, '올해의 나는 ___ 시간에 가장 집중했다.', 'single', 1);

  INSERT INTO labs.question_options (question_id, text, points, order_index) VALUES
  (q1_id, '일이나 목표', jsonb_build_object(result_focused_id::text, 2, result_multi_id::text, 1), 1),
  (q1_id, '관계나 사람', jsonb_build_object(result_explorer_id::text, 2, result_multi_id::text, 1), 2),
  (q1_id, '나 자신', jsonb_build_object(result_healing_id::text, 2, result_multi_id::text, 1), 3),
  (q1_id, '변화와 새로운 시도', jsonb_build_object(result_explorer_id::text, 2, result_multi_id::text, 1), 4);

  -- Q2
  q2_id := gen_random_uuid();
  INSERT INTO labs.questions (id, test_id, text, type, order_index) VALUES
  (q2_id, test_id, '예상치 못한 상황이 왔을 때 나는 ___ 했다.', 'single', 2);

  INSERT INTO labs.question_options (question_id, text, points, order_index) VALUES
  (q2_id, '침착하게 대처했다', jsonb_build_object(result_focused_id::text, 2), 1),
  (q2_id, '계획을 새로 짰다', jsonb_build_object(result_focused_id::text, 1, result_explorer_id::text, 1), 2),
  (q2_id, '조금 흔들렸지만 결국 적응했다', jsonb_build_object(result_multi_id::text, 2), 3),
  (q2_id, '그냥 부딪혀봤다', jsonb_build_object(result_explorer_id::text, 2), 4);

  -- Q3
  q3_id := gen_random_uuid();
  INSERT INTO labs.questions (id, test_id, text, type, order_index) VALUES
  (q3_id, test_id, '올해 가장 많이 떠올린 단어는?', 'single', 3);

  INSERT INTO labs.question_options (question_id, text, points, order_index) VALUES
  (q3_id, '안정', jsonb_build_object(result_focused_id::text, 2), 1),
  (q3_id, '도전', jsonb_build_object(result_explorer_id::text, 2), 2),
  (q3_id, '성장', jsonb_build_object(result_multi_id::text, 2), 3),
  (q3_id, '회복', jsonb_build_object(result_healing_id::text, 2), 4);

  -- Add remaining 7 questions (simplified for now)
  FOR i IN 4..10 LOOP
    DECLARE
      q_id uuid := gen_random_uuid();
    BEGIN
      INSERT INTO labs.questions (id, test_id, text, type, order_index) VALUES
      (q_id, test_id, format('질문 %s', i), 'single', i);

      -- Add 4 options per question
      INSERT INTO labs.question_options (question_id, text, points, order_index) VALUES
      (q_id, format('옵션 A %s', i), jsonb_build_object(result_focused_id::text, 2), 1),
      (q_id, format('옵션 B %s', i), jsonb_build_object(result_explorer_id::text, 2), 2),
      (q_id, format('옵션 C %s', i), jsonb_build_object(result_multi_id::text, 2), 3),
      (q_id, format('옵션 D %s', i), jsonb_build_object(result_healing_id::text, 2), 4);
    END;
  END LOOP;

END $$;
```

**Step 2: Apply seed data**

Using Supabase dashboard:
1. Open SQL Editor
2. Paste and run `scripts/seed-test-data.sql`
3. Verify: Check `labs.tests`, `labs.questions`, `labs.question_options`, `labs.results`

**Step 3: Test locally**

Run:
```bash
npm run dev
```

Visit: http://localhost:3000/tests/2025-keyword-check
Expected: Test intro screen with title and start button

**Step 4: Commit**

```bash
git add scripts/seed-test-data.sql
git commit -m "feat: add seed data for first test

- Create 2025 keyword check test
- Add 10 questions with 4 options each
- Define 4 result types with point scoring
- Ready for testing"
```

---

## Next Steps

This implementation plan continues with:
- Phase 2: Question flow, result calculation, result page
- Phase 3: Admin dashboard
- Phase 4: SEO, analytics, deployment

Each phase will be documented in similar detail with exact code and testing steps.

**Total estimated time:** 2-3 weeks for full implementation

---

## Execution Handoff

Plan saved to: `docs/plans/2025-11-14-labs-implementation.md`

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration with quality gates

**2. Parallel Session (separate)** - Open new Claude Code session, use executing-plans skill for batch execution with checkpoints

**Which approach would you prefer?**
