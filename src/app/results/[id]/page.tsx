import { notFound } from 'next/navigation';
import { getTestResult, type TestResultWithRelations } from '@/lib/data/tests';
import { Card } from '@/components/ui/card';
import { ShareButtons } from '@/components/result/ShareButtons';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ISR: Generate on-demand, cache forever
export const revalidate = false;

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const data = await getTestResult(id);

  if (!data) {
    return {
      title: 'Result Not Found',
    };
  }

  const result = data.result;
  const test = data.test;

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
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getTestResult(id);

  if (!data) {
    notFound();
  }

  const result = data.result;
  const test = data.test;

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
            <img src={result.image_url} alt={result.title} className="w-full h-auto" />
          </div>
        )}

        {/* Keywords */}
        {result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {result.keywords.map((keyword, index) => (
              <span key={index} className="px-4 py-1.5 rounded-full border border-primary text-primary text-sm">
                #{keyword}
              </span>
            ))}
          </div>
        )}

        {/* Result Title */}
        <h1 className="text-3xl font-bold text-center mb-6">{result.title}</h1>

        {/* Result Description */}
        <Card className="p-6 mb-8">
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">{result.description}</p>
        </Card>

        {/* Action Buttons */}
        <ShareButtons
          title={result.title}
          description={result.share_description}
          url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/results/${id}`}
          testSlug={test.slug}
        />

        {/* Footer */}
        <p className="text-center text-sm text-text-tertiary mt-8">{test.share_text || '2025 나의 키워드 찾기'} ✨</p>
      </div>
    </main>
  );
}
