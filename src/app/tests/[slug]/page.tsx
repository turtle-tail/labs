import { notFound } from 'next/navigation'
import { getTestBySlug, getPublishedTestsForBuild } from '@/lib/data/tests'
import { TestContainer } from './TestContainer'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all published tests
export async function generateStaticParams() {
  const tests = await getPublishedTestsForBuild()
  return tests.map((test) => ({
    slug: test.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const test = await getTestBySlug(slug)

  if (!test) {
    return {
      title: 'Test Not Found',
    }
  }

  return {
    title: test.title,
    description: test.description,
    openGraph: {
      title: test.title,
      description: test.description || undefined,
      images: test.thumbnail ? [{ url: test.thumbnail }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: test.title,
      description: test.description || undefined,
      images: test.thumbnail ? [test.thumbnail] : [],
    },
  }
}

export default async function TestPage({ params }: PageProps) {
  const { slug } = await params
  const test = await getTestBySlug(slug)

  if (!test) {
    notFound()
  }

  return <TestContainer test={test} />
}
