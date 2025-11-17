'use client';

import { useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { OptionCard } from './OptionCard';
import { TestWithQuestions } from '@/lib/data/tests';
import { submitTest } from '@/app/tests/[slug]/actions';

interface QuestionFlowProps {
  test: TestWithQuestions;
}

const LABELS = ['A', 'B', 'C', 'D'] as const;

export function QuestionFlow({ test }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentQuestion = test.questions[currentIndex];
  const totalQuestions = test.questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = async (optionIndex: number) => {
    // Prevent duplicate clicks
    if (isProcessing || isSubmitting) {
      return;
    }

    setIsProcessing(true);

    // Save answer with 1-based indices
    const questionNumber = currentIndex + 1;
    const optionNumber = optionIndex + 1;
    const newAnswers = { ...answers, [questionNumber]: optionNumber };
    setAnswers(newAnswers);

    // Check if this is the last question
    if (currentIndex === totalQuestions - 1) {
      // Submit test
      setIsSubmitting(true);
      try {
        await submitTest(test.id, newAnswers);
      } catch (error) {
        // Re-throw redirect errors (these are not actual errors)
        if (isRedirectError(error)) {
          throw error;
        }
        console.error('Failed to submit test:', error);
        setIsSubmitting(false);
        setIsProcessing(false);
        alert('결과 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      // Move to next question immediately
      setCurrentIndex((prev) => prev + 1);
      setIsProcessing(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-content w-full text-center">
          <div className="mb-6 text-6xl">✨</div>
          <p className="text-text-secondary">결과를 계산하고 있어요...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-[512px] w-full flex flex-col gap-12">
        {/* Progress Indicator */}
        <div className="flex flex-col gap-2 items-center w-full">
          <p className="text-sm leading-5 text-stone-500 text-center tracking-tight">
            Step {currentIndex + 1} of {totalQuestions}
          </p>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-[400ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question & Options */}
        <div key={currentIndex} className="flex flex-col gap-12 items-center w-full animate-fade-slide-in">
          {/* Question */}
          <h2 className="text-2xl leading-10 font-semibold text-center text-stone-900 tracking-tight whitespace-pre-wrap">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-4 w-full">
            {currentQuestion.options.map((option, index) => (
              <OptionCard
                key={option.id}
                label={LABELS[index]}
                text={option.text}
                isSelected={false}
                onClick={() => handleSelectOption(index)}
                disabled={isProcessing || isSubmitting}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
