import Script from 'next/script';

const PUBLISHER_ID = 'ca-pub-5375099993721387';

export function AdSenseScript() {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
