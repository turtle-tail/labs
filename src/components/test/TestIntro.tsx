'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TestIntroProps {
  title: string;
  description: string | null;
  questionCount: number;
  estimatedTime: number;
  onStart: () => void;
}

// Test-specific result images
const TEST_NAME = '2025_나의_키워드_3개_찾기';
const RESULT_IMAGES = [
  `/result_images/${TEST_NAME}/꾸준히 나와 친해진 나.png`,
  `/result_images/${TEST_NAME}/내 스타일은 내가 만든다.png`,
  `/result_images/${TEST_NAME}/맛집 탐방하듯 인생 살아간 나.png`,
  `/result_images/${TEST_NAME}/몰입하면 다 되는 나.png`,
  `/result_images/${TEST_NAME}/밸런스 마스터.png`,
  `/result_images/${TEST_NAME}/사람들과 있을 때 빛나는 나.png`,
  `/result_images/${TEST_NAME}/올해도 레벨업.png`,
  `/result_images/${TEST_NAME}/좋은 에너지 전파하는 히어로 나.png`,
];

export function TestIntro({ title, onStart }: TestIntroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set random initial index after first render (in setTimeout to avoid lint error)
    const randomStart = Math.floor(Math.random() * RESULT_IMAGES.length);
    const timeout = setTimeout(() => {
      setCurrentImageIndex(randomStart);
    }, 0);

    // Change image every 2 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % RESULT_IMAGES.length);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="w-[375px] h-full flex flex-col items-center justify-center gap-[50px] py-12">
        {/* Image Carousel */}
        <div className="relative w-full aspect-square overflow-hidden bg-stone-100" suppressHydrationWarning>
          {RESULT_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              suppressHydrationWarning
            >
              <Image src={src} alt="Result preview" fill className="object-cover" priority />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="w-full flex flex-col items-center gap-12">
          {/* Text */}
          <div className="w-full flex flex-col items-center gap-4">
            <h1 className="text-[30px] leading-[36px] font-semibold text-stone-800 tracking-[-0.3px] text-center">
              {title}
            </h1>

            <div className="w-full flex flex-col items-center gap-1.5">
              <p className="text-base leading-6 text-[#57534d] tracking-[-0.064px] text-center">
                2025년의 나는 어떤 모습이었을까?
              </p>
              <p className="text-sm leading-5 text-[#79716b] tracking-[-0.056px] text-center">
                올해의 당신을 가장 잘 설명하는 선택지를 골라보세요.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStart}
            className="bg-emerald-600 px-10 py-4 rounded-[48px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-emerald-700 transition-colors duration-200 cursor-pointer"
          >
            <span className="text-base leading-5 font-medium text-white tracking-[-0.1504px]">시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
