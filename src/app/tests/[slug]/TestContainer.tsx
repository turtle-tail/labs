'use client'

import { useState } from 'react'
import { TestIntro } from '@/components/test/TestIntro'
import { QuestionFlow } from '@/components/test/QuestionFlow'
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

  return <QuestionFlow test={test} />
}
