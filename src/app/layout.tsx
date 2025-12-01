import type { Metadata } from 'next';
import { pretendard, inter } from './fonts';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { GoogleAds } from '@/components/analytics/GoogleAds';
import { MicrosoftClarity } from '@/components/analytics/MicrosoftClarity';

export const metadata: Metadata = {
  title: 'Labs - 심리테스트',
  description: '재미있는 심리테스트를 풀고 친구들과 공유해보세요!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${inter.variable}`}>
      <body className="bg-stone-200">
        {/* Desktop wrapper: gray background with white centered container */}
        <div className="min-h-screen md:bg-stone-200 md:flex md:items-center md:justify-center">
          <div className="w-full md:max-w-[375px] md:min-h-screen md:bg-white md:shadow-lg">{children}</div>
        </div>
        <Toaster />
        <GoogleAnalytics />
        <GoogleAds />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
