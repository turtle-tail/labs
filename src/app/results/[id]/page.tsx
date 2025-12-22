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
    <main className="min-h-screen bg-stone-50 flex flex-col items-center px-0 py-0">
      <div className="w-[375px] flex flex-col gap-8">
        {/* Hero Image */}
        <div className="w-full h-[350px] overflow-hidden relative">
          {result.image_url && (
            <Image
              src={result.image_url}
              alt={result.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 375px"
            />
          )}
        </div>

        {/* Content Container */}
        <div className="w-full flex flex-col gap-[58px] px-6 pb-10">
          {/* Title, Keywords, Description */}
          <div className="w-full flex flex-col gap-[18px] items-center">
            {/* Main Title */}
            <h1 className="text-[28px] leading-[39px] font-semibold text-center text-stone-800 tracking-[0.0703px] w-full whitespace-pre-wrap">
              2025년, 나의 키워드는
            </h1>

            {/* Result Title */}
            <p className="text-xl leading-normal font-semibold text-center text-stone-800 w-full whitespace-pre-wrap">
              &quot;{result.title}&quot;
            </p>

            {/* Keywords */}
            {result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {result.keywords.slice(0, 3).map((keyword: string, index: number) => (
                  <div
                    key={index}
                    className="h-10 px-[18px] bg-white border border-emerald-200 rounded-full flex items-center justify-center"
                  >
                    <span className="text-base leading-6 font-semibold text-[#007a55] tracking-[-0.3125px]">
                      #{keyword}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="bg-white border border-stone-200 rounded-2xl px-6 py-8 w-full">
              <p className="text-base leading-[1.65] text-stone-700 text-center tracking-[-0.3125px] whitespace-pre-wrap">
                {result.this_year_description || result.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <ShareButtons
              title={result.title}
              description={result.share_description}
              url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/results/${id}`}
              testSlug={test.slug}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
