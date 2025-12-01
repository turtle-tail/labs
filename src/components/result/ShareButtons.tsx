'use client'

import { toast } from 'sonner'

interface ShareButtonsProps {
  title: string
  description: string
  url: string
  testSlug: string
}

export function ShareButtons({ url, testSlug }: ShareButtonsProps) {
  const handleShare = async () => {
    // Default to copy link
    await handleCopyLink()
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('링크가 복사되었습니다!', {
        duration: 2000,
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('링크 복사에 실패했습니다')
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Share Link Button */}
      <button
        onClick={handleShare}
        className="h-12 bg-white border border-stone-300 rounded-3xl flex items-center justify-center gap-4 transition-opacity hover:opacity-80 cursor-pointer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-sm leading-5 font-medium text-stone-700 tracking-[-0.1504px]">링크 공유</span>
      </button>

      {/* Retry Button */}
      <a
        href={`/tests/${testSlug}`}
        className="h-12 bg-emerald-600 rounded-3xl flex items-center justify-center gap-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 cursor-pointer"
      >
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-sm leading-5 font-medium text-white tracking-[-0.1504px]">다시 해보기</span>
      </a>
    </div>
  );
}
