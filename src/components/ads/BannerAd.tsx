'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function BannerAd() {
  const adRef = useRef<HTMLModElement>(null);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    try {
      if (adRef.current && adRef.current.childNodes.length === 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      setAdError(true);
    }
  }, []);

  if (adError) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-full max-w-[375px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5375099993721387"
          data-ad-slot="7789866813"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
