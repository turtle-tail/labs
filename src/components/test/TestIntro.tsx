'use client'

import { Button } from '@/components/ui/button'

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
