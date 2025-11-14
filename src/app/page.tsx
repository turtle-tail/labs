import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-content w-full text-center">
        <div className="mb-6 text-6xl">✨</div>
        <h1 className="text-3xl font-bold mb-4">Labs</h1>
        <p className="text-text-secondary mb-8">
          재미있는 심리테스트 플랫폼
        </p>
        <Link href="/tests/2025-keyword-check">
          <Button>첫 번째 테스트 시작하기</Button>
        </Link>
      </div>
    </main>
  )
}
