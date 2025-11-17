import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTestResult } from '@/lib/data/tests';
import { ShareButtons } from '@/components/result/ShareButtons';

interface PageProps {
  params: Promise<{ id: string }>;
}

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
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-[512px] w-full flex flex-col gap-8">
        {/* Hero Image */}
        <div className="w-full h-64 bg-white border border-stone-200 rounded-3xl overflow-hidden relative">
          {result.image_url && (
            <Image
              src={result.image_url}
              alt={result.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          )}
        </div>

        {/* Keywords */}
        {result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && (
          <div className="flex justify-center gap-3">
            {result.keywords.slice(0, 3).map((keyword: string, index: number) => (
              <div
                key={index}
                className="h-12 px-5 bg-white border border-emerald-200 rounded-full flex items-center justify-center"
              >
                <span className="text-base leading-6 text-emerald-700 tracking-tight">#{keyword}</span>
              </div>
            ))}
          </div>
        )}

        {/* Result Title */}
        <h1 className="text-2xl leading-10 text-center text-stone-800 tracking-normal">{result.title}</h1>

        {/* This Year's Description */}
        {result.this_year_description && (
          <div className="bg-white border border-stone-200 rounded-3xl p-8">
            <h2 className="text-lg font-semibold text-stone-800 mb-4 text-center">올해의 나</h2>
            <p className="text-base leading-7 text-stone-700 text-center tracking-tight whitespace-pre-wrap">
              {result.this_year_description}
            </p>
          </div>
        )}

        {/* Next Year's Advice */}
        {result.next_year_advice && (
          <div className="bg-white border border-stone-200 rounded-3xl p-8">
            <h2 className="text-lg font-semibold text-stone-800 mb-4 text-center">내년 조언</h2>
            <p className="text-base leading-7 text-stone-700 text-center tracking-tight whitespace-pre-wrap">
              {result.next_year_advice}
            </p>
          </div>
        )}

        {/* Legacy Description (for backward compatibility) */}
        {result.description && !result.this_year_description && !result.next_year_advice && (
          <div className="bg-white border border-stone-200 rounded-3xl p-8">
            <p className="text-base leading-7 text-stone-700 text-center tracking-tight whitespace-pre-wrap">
              {result.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <ShareButtons
          title={result.title}
          description={result.share_description}
          url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/results/${id}`}
          testSlug={test.slug}
        />

        {/* Footer Text */}
        <p className="text-xs leading-4 text-[#79716b] text-center">2025 나의 키워드 찾기 ✨</p>
      </div>
    </main>
  );
}
