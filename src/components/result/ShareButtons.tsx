'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonsProps {
  title: string
  description: string
  url: string
  testSlug: string
}

export function ShareButtons({ title, description, url, testSlug }: ShareButtonsProps) {
  const handleShare = async () => {
    // Check if Web Share API is available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (error) {
        // User cancelled share or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error)
          handleCopyLink()
        }
      }
    } else {
      // Fallback to copy link
      handleCopyLink()
    }
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
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="flex-1"
        onClick={handleShare}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        링크 공유
      </Button>

      <Button
        className="flex-1"
        asChild
      >
        <a href={`/tests/${testSlug}`}>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          다시 해보기
        </a>
      </Button>
    </div>
  )
}
