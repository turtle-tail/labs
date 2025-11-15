# Labs - Implementation Plan (MVP)

**Date:** 2025-11-15
**Target:** First deployment (test flow + analytics/SEO, no admin)
**Approach:** Vertical Slice (feature-complete milestones)

## Scope

### In Scope ✅
- Test flow (intro → questions → result)
- Result sharing with Open Graph
- Analytics integration (GA4, Clarity)
- SEO optimization (sitemap, robots.txt, Search Console)
- Anonymous user experience (no login)
- SSG for test pages, ISR for results

### Out of Scope ❌
- Admin dashboard (future phase)
- User authentication
- Test analytics dashboard
- Dynamic OG image generation

## Technical Decisions

### UI Library
- **shadcn/ui** for all components
- Replaces existing Button, Card, ProgressBar, Tag
- Uses: toast, button, card, progress, plus custom components

### Key Dependencies
- Next.js 15 (App Router)
- Tailwind CSS 4
- shadcn/ui
- Supabase (PostgreSQL + client)
- Google Analytics 4
- Microsoft Clarity

## Implementation Milestones

### Milestone 1: Core Test Flow (4-6 hours)

**Goal:** Users can take a test and see results

**Components to build:**
- QuestionFlow component (client-side state management)
- OptionCard component (shadcn-based)
- ResultDisplay component
- submitTest Server Action
- Result calculation logic

**Pages:**
- `/tests/[slug]` - already exists, add QuestionFlow
- `/results/[id]` - create new (ISR)

**Data flow:**
1. User clicks option → answer saved in React state
2. Auto-advance to next question
3. On completion → submitTest Server Action
4. Calculate result → save to DB → redirect to result page

**Files:**
- `src/components/test/QuestionFlow.tsx` (new)
- `src/components/test/OptionCard.tsx` (new)
- `src/components/result/ResultDisplay.tsx` (new)
- `src/app/tests/[slug]/actions.ts` (new)
- `src/app/results/[id]/page.tsx` (new)
- `src/lib/utils/calculate-result.ts` (new)

### Milestone 2: Sharing & UX (2-3 hours)

**Goal:** Users can share results via social media

**Features:**
- Link copy button with toast notification
- Web Share API integration (mobile)
- Open Graph meta tags (already partially done, enhance)
- Progress bar animation
- Mobile optimization

**Components:**
- ShareButtons (with shadcn toast)
- Enhanced metadata in result page

**Files:**
- `src/components/result/ShareButtons.tsx` (new)
- Update `src/app/results/[id]/page.tsx` metadata
- shadcn setup: `npx shadcn@latest init && add toast button card progress`

### Milestone 3: Analytics & SEO (2-3 hours)

**Goal:** Full analytics and search engine visibility

**Integrations:**
- Google Analytics 4 (pageviews + events)
- Microsoft Clarity (session replay)
- Google Search Console setup
- Naver Search Advisor setup

**SEO files:**
- `app/sitemap.ts` - auto-generate from published tests
- `app/robots.txt` - allow all
- Enhanced meta tags across all pages

**Files:**
- `src/app/layout.tsx` - add analytics scripts
- `src/app/sitemap.ts` (new)
- `src/app/robots.txt` (new)
- Environment variables: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID`

## Setup Tasks (Before M1)

1. Install shadcn/ui: `npx shadcn@latest init`
2. Add components: `npx shadcn@latest add toast button card progress`
3. Delete old UI components:
   - `src/components/ui/Button.tsx`
   - `src/components/ui/Card.tsx`
   - `src/components/ui/ProgressBar.tsx`
   - `src/components/ui/Tag.tsx`
4. Update imports in existing files (TestIntro.tsx)

## Testing Checklist

- [ ] Test flow works end-to-end (intro → questions → result)
- [ ] Result calculation is correct (matches seed data)
- [ ] Results are cached (ISR working)
- [ ] Share button copies link and shows toast
- [ ] Mobile responsive (test on iPhone/Android)
- [ ] OG tags render correctly (test with https://www.opengraph.xyz/)
- [ ] Analytics fires events (check GA real-time)
- [ ] Sitemap accessible at `/sitemap.xml`

## Deployment

**Platform:** DigitalOcean App Platform (already configured)

**Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_CLARITY_ID=
```

**Deploy trigger:** Git push to `main` branch

## Success Criteria

- ✅ Users can complete test without errors
- ✅ Results are shareable via URL
- ✅ OG preview shows correct image/text
- ✅ Page load < 2s (Lighthouse)
- ✅ Analytics tracking works
- ✅ Site indexed by Google/Naver

## Future Enhancements (Post-MVP)

- Admin dashboard for test management
- Dynamic OG image generation
- Test analytics (completion rates, popular results)
- Multiple test support on home page
- Instagram story templates
