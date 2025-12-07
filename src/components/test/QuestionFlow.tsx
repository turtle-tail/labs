'use client';

import { useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import Lottie from 'lottie-react';
import { OptionCard } from './OptionCard';
import { TestWithQuestions } from '@/lib/data/tests';
import { submitTest } from '@/app/tests/[slug]/actions';
import { BannerAd } from '@/components/ads/BannerAd';
import { InterstitialAd } from '@/components/ads/InterstitialAd';
import loadingAnimation from '../../../public/loading.json';

interface QuestionFlowProps {
  test: TestWithQuestions;
}

const LABELS = ['A', 'B', 'C', 'D'] as const;

export function QuestionFlow({ test }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState<Record<number, number> | null>(null);

  const currentQuestion = test.questions[currentIndex];
  const totalQuestions = test.questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleCloseInterstitial = async () => {
    setShowInterstitial(false);
    if (!pendingAnswers) return;

    setIsSubmitting(true);
    try {
      await submitTest(test.id, pendingAnswers);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      console.error('Failed to submit test:', error);
      setIsSubmitting(false);
      alert('결과 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

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
      // Show interstitial ad before submitting
      setPendingAnswers(newAnswers);
      setShowInterstitial(true);
      setIsProcessing(false);
    } else {
      // Move to next question immediately
      setCurrentIndex((prev) => prev + 1);
      setIsProcessing(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="max-w-[375px] w-full flex flex-col items-center gap-6">
          <div className="w-48 h-48">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
          <p className="text-base text-stone-600 text-center">결과를 계산하고 있어요...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showInterstitial && <InterstitialAd onClose={handleCloseInterstitial} />}
      <div className="h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-[375px] h-full flex flex-col gap-12 justify-start py-[48px] pb-[120px] px-[22.311px]">
          {/* Progress Indicator */}
          <div className="flex flex-col gap-2 items-center w-full">
            <p className="text-sm leading-5 text-[#79716b] text-center tracking-[-0.1504px]">
              {currentIndex + 1} / {totalQuestions}
            </p>
            <div className="w-full h-[6px] bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-400 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question & Options */}
          <div key={currentIndex} className="flex flex-col gap-12 items-center w-full animate-fade-slide-in">
            {/* Question */}
            <h2 className="text-2xl leading-[39px] font-semibold text-center text-stone-800 tracking-[-0.24px] whitespace-pre-wrap max-w-[335px]">
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
      <BannerAd />
    </>
  );
}
