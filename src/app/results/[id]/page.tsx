import { notFound } from 'next/navigation';
import { getTestResult, type TestResultWithRelations } from '@/lib/data/tests';
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
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-12">
      <div className="max-w-[512px] w-full flex flex-col gap-8">
        {/* Hero Image */}
        <div className="w-full h-[258px] bg-white border border-stone-200 rounded-[24px] overflow-hidden">
          {result.image_url && (
            <img src={result.image_url} alt={result.title} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Keywords */}
        {result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && (
          <div className="flex justify-center gap-3">
            {result.keywords.slice(0, 3).map((keyword, index) => (
              <div
                key={index}
                className="h-[46px] px-[21px] pt-[14px] pb-px bg-white border border-[#a4f4cf] rounded-full flex items-center justify-center"
              >
                <span className="text-base leading-6 text-[#007a55] tracking-[-0.3125px]">
                  #{keyword}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Result Title */}
        <h1 className="text-2xl leading-[39px] text-center text-stone-800 tracking-[0.0703px]">
          {result.title}
        </h1>

        {/* Result Description */}
        <div className="bg-white border border-stone-200 rounded-[24px] p-8">
          <p className="text-base leading-[26px] text-[#44403b] text-center tracking-[-0.3125px] whitespace-pre-wrap">
            {result.description}
          </p>
        </div>

        {/* Action Buttons */}
        <ShareButtons
          title={result.title}
          description={result.share_description}
          url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/results/${id}`}
          testSlug={test.slug}
        />

        {/* Footer Text */}
        <p className="text-xs leading-4 text-[#79716b] text-center">
          2025 나의 키워드 찾기 ✨
        </p>
      </div>
    </main>
  );
}
