'use client'

import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { OptionCard } from './OptionCard'
import { TestWithQuestions } from '@/lib/data/tests'
import { submitTest } from '@/app/tests/[slug]/actions'

interface QuestionFlowProps {
  test: TestWithQuestions
}

const LABELS = ['A', 'B', 'C', 'D'] as const

export function QuestionFlow({ test }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = test.questions[currentIndex]
  const totalQuestions = test.questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  // Load saved progress from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`test-progress-${test.id}`)
    if (saved) {
      try {
        const { index, answers: savedAnswers } = JSON.parse(saved)
        setCurrentIndex(index)
        setAnswers(savedAnswers)
      } catch (e) {
        console.error('Failed to load saved progress:', e)
      }
    }
  }, [test.id])

  // Save progress to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      `test-progress-${test.id}`,
      JSON.stringify({ index: currentIndex, answers })
    )
  }, [currentIndex, answers, test.id])

  const handleSelectOption = async (optionId: string) => {
    // Save answer
    const newAnswers = { ...answers, [currentQuestion.id]: optionId }
    setAnswers(newAnswers)

    // Check if this is the last question
    if (currentIndex === totalQuestions - 1) {
      // Submit test
      setIsSubmitting(true)
      try {
        await submitTest(test.id, newAnswers)
        // Clear saved progress
        sessionStorage.removeItem(`test-progress-${test.id}`)
      } catch (error) {
        console.error('Failed to submit test:', error)
        setIsSubmitting(false)
        alert('결과 저장에 실패했습니다. 다시 시도해주세요.')
      }
    } else {
      // Move to next question
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 300)
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-content w-full text-center">
          <div className="mb-6 text-6xl">✨</div>
          <p className="text-text-secondary">결과를 계산하고 있어요...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="max-w-content w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
          <p className="text-sm text-text-tertiary mb-2 text-center">
            Step {currentIndex + 1} of {totalQuestions}
          </p>
          <Progress
            value={progress}
            className="h-1 transition-all duration-300 ease-out"
          />
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-center mb-12">
          {currentQuestion.text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <OptionCard
              key={option.id}
              label={LABELS[index]}
              text={option.text}
              isSelected={answers[currentQuestion.id] === option.id}
              onClick={() => handleSelectOption(option.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
