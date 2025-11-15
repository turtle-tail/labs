import type { Metadata } from 'next';
import { pretendard } from './fonts';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
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
    <html lang="ko" className={pretendard.variable}>
      <body>
        {children}
        <Toaster />
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
