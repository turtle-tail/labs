'use client'

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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-[512px] w-full flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#d0fae5] rounded-[24px] flex items-center justify-center">
          <span className="text-[36px] leading-[40px]">✨</span>
        </div>

        {/* Title */}
        <h1 className="text-[30px] leading-[36px] font-normal text-[#1c1917] tracking-[0.3955px]">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <div className="flex flex-col gap-2">
            {description.split('\n').map((line, i) => (
              <p
                key={i}
                className={i === 0
                  ? "text-base leading-6 text-[#57534d] tracking-[-0.3125px]"
                  : "text-sm leading-5 text-[#79716b] tracking-[-0.1504px]"
                }
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="bg-[#009966] h-12 px-12 rounded-[48px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
        >
          <span className="text-sm leading-5 font-medium text-white tracking-[-0.1504px]">
            시작하기
          </span>
        </button>

        {/* Meta info */}
        <p className="text-sm text-[#79716b]">
          {questionCount}개의 질문 • 약 {estimatedTime}분 소요
        </p>
      </div>
    </div>
  )
}
