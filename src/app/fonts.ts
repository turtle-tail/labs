import { Inter } from 'next/font/google';

// Inter font for design system
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Using system fonts as fallback until Pretendard is downloaded
export const pretendard = {
  variable: '--font-pretendard',
} as const;
