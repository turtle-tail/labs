import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-content w-full text-center">
        {/* Image placeholder */}
        <div className="mb-6 w-full aspect-square bg-gray-200 rounded-lg"></div>

        <h1 className="text-2xl font-bold mb-3">2025 나의 키워드 3개 찾기</h1>
        <p className="text-base font-medium mb-2">
          2025년의 나는 어떤 모습이었을까?
        </p>
        <p className="text-sm text-text-secondary mb-8">
          올해의 당신을 가장 잘 설명하는 선택지를 골라보세요.
        </p>

        <Link href="/tests/2025-keyword-check">
          <Button className="w-full max-w-[200px]">시작하기</Button>
        </Link>
      </div>
    </main>
  )
}
