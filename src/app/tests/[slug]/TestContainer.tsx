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
