'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface InterstitialAdProps {
  onClose: () => void;
}

export function InterstitialAd({ onClose }: InterstitialAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    try {
      if (adRef.current && adRef.current.childNodes.length === 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch {
      setAdError(true);
      onClose();
    }
  }, [onClose]);

  // If ad fails to load, close immediately
  if (adError) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-stone-800 hover:bg-white transition-colors"
        aria-label="Close ad"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Ad container */}
      <div className="w-full max-w-[375px] mx-4 bg-white rounded-lg overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '250px' }}
          data-ad-client="ca-pub-5375099993721387"
          data-ad-slot="YOUR_INTERSTITIAL_AD_SLOT_ID"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        {!adLoaded && (
          <div className="flex items-center justify-center h-[250px] text-stone-400">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
