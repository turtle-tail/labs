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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-12">
      <div className="max-w-[375px] w-full flex flex-col gap-12">
        {/* Progress Indicator */}
        <div className="flex flex-col gap-2 items-center w-full">
          <p className="text-sm leading-5 text-[#79716b] text-center tracking-[-0.1504px]">
            Step {currentIndex + 1} of {totalQuestions}
          </p>
          <div className="w-full h-[6px] bg-[#e7e5e4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#009966] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question & Options */}
        <div className="flex flex-col gap-12 items-center w-full">
          {/* Question */}
          <h2 className="text-2xl leading-[39px] font-semibold text-center text-[#1c1917] tracking-[-0.24px] max-w-[335px] whitespace-pre-wrap">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-4 w-full">
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
    </div>
  )
}
