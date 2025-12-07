# AdSense Integration Design

## Overview

Google AdSense integration for `labs.turtle-tail.com` to display banner and interstitial ads during test flow.

## Configuration

- **Publisher ID**: `ca-pub-5375099993721387`
- **Domain**: `turtle-tail.com` (covers `labs.turtle-tail.com` subdomain)

## Components

```
src/components/ads/
├── AdSenseScript.tsx   # Global AdSense script (inserted in layout.tsx)
├── BannerAd.tsx        # Sticky bottom banner ad
└── InterstitialAd.tsx  # Fullscreen interstitial ad
```

### 1. AdSenseScript

- Global script loaded once in `layout.tsx`
- Loads `adsbygoogle.js` with publisher ID

### 2. BannerAd

- **Location**: Test page bottom (sticky)
- **Size**: Auto (Google optimizes)
- **Visibility**: Always visible during test progress
- **Padding**: Ensure no overlap with choice buttons

```
┌─────────────────────┐
│     Question        │
│                     │
│   [Choice buttons]  │
│                     │
├─────────────────────┤
│   Banner Ad         │  ← sticky bottom
└─────────────────────┘
```

### 3. InterstitialAd

- **Trigger**: After last question answered
- **Display**: Fullscreen overlay with dark background
- **Close button**: Top-right X, immediately clickable
- **After close**: Navigate to results page

```
┌─────────────────────┐
│ [X]                 │  ← close button (immediate)
│                     │
│   Interstitial Ad   │
│   (large format)    │
│                     │
└─────────────────────┘
     (dark overlay)
```

## User Flow

1. User starts test
2. Banner ad visible at bottom during questions
3. User answers last question
4. Interstitial ad overlay appears
5. User clicks X to close
6. Navigate to results page (`/results/[id]`)

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Ad load failure | Hide ad space gracefully |
| AdBlocker detected | Hide ad area, test works normally |
| Interstitial load failure | Skip directly to results page |

## Principles

- Ads must not block test functionality
- UX priority over ad revenue
- Graceful degradation on any ad failure
