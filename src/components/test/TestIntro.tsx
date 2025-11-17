'use client';

interface TestIntroProps {
  title: string;
  description: string | null;
  questionCount: number;
  estimatedTime: number;
  onStart: () => void;
}

export function TestIntro({ title, description, questionCount, estimatedTime, onStart }: TestIntroProps) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="w-full flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center">
          <span className="text-4xl leading-10">✨</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl leading-9 font-normal text-stone-900 tracking-normal">{title}</h1>

        {/* Description */}
        {description && (
          <div className="flex flex-col gap-2">
            {description.split('\n').map((line, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-base leading-6 text-stone-600 tracking-tight'
                    : 'text-sm leading-5 text-stone-500 tracking-tight'
                }
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* CTA Button - Figma Design System */}
        <button
          onClick={onStart}
          className="bg-emerald-600 px-10 py-4 rounded-full shadow-sm hover:bg-emerald-700 transition-colors duration-200 cursor-pointer"
        >
          <span className="text-base leading-5 font-medium text-white tracking-tight">시작하기</span>
        </button>

        {/* Meta info */}
        <p className="text-sm text-stone-500">
          {questionCount}개의 질문 • 약 {estimatedTime}분 소요
        </p>
      </div>
    </div>
  );
}
