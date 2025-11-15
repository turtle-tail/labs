import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTestResult, type TestResultWithRelations } from '@/lib/data/tests'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PageProps {
  params: Promise<{ id: string }>
}

// ISR: Generate on-demand, cache forever
export const revalidate = false

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const data = await getTestResult(id)

  if (!data) {
    return {
      title: 'Result Not Found',
    }
  }

  const result = data.result
  const test = data.test

  return {
    title: `나는 '${result.title}'!`,
    description: result.share_description,
    openGraph: {
      title: result.title,
      description: result.share_description,
      images: result.image_url ? [{ url: result.image_url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: result.title,
      description: result.share_description,
      images: result.image_url ? [result.image_url] : [],
    },
  }
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params
  const data = await getTestResult(id)

  if (!data) {
    notFound()
  }

  const result = data.result
  const test = data.test

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="max-w-content w-full">
        {/* Decorative sparkles */}
        <div className="text-center mb-6">
          <div className="inline-flex gap-4 text-2xl opacity-50">
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
          </div>
        </div>

        {/* Result Image (placeholder for now) */}
        {result.image_url && (
          <div className="mb-6 rounded-2xl overflow-hidden">
            <img
              src={result.image_url}
              alt={result.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Keywords */}
        {result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {result.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-1.5 rounded-full border border-primary text-primary text-sm"
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}

        {/* Result Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          {result.title}
        </h1>

        {/* Result Description */}
        <Card className="p-6 mb-8">
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {result.description}
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              alert('링크가 복사되었습니다!')
            }}
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

          <Link href={`/tests/${test.slug}`} className="flex-1">
            <Button className="w-full">
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
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-text-tertiary mt-8">
          {test.share_text || '2025 나의 키워드 찾기'} ✨
        </p>
      </div>
    </main>
  )
}
