import { MetadataRoute } from 'next'
import { getPublishedTestsForBuild } from '@/lib/data/tests'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://labs.turtle-tail.com'

  // Get all published tests
  const tests = await getPublishedTestsForBuild()

  // Generate test pages URLs
  const testPages = tests.map((test) => ({
    url: `${baseUrl}/tests/${test.slug}`,
    lastModified: new Date(test.updated_at || test.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...testPages,
  ]
}
