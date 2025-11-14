# Labs - Viral Quiz Platform Design

**Date:** 2025-11-14
**Status:** Approved
**Figma Design:** https://script-neon-67078207.figma.site

## Overview

Labs is a viral psychological test/quiz platform focused on shareability and engagement. Users can take fun personality tests, get results, and share them via social media with unique URLs.

## Project Goals

- **Primary:** Create engaging, shareable psychological tests
- **Performance:** Fast page loads via SSG for SEO optimization
- **Viral Growth:** Easy sharing with Open Graph metadata
- **Content Quality:** Admin-curated tests (not user-generated)

## Core Decisions

### User Experience
- **Authentication:** Completely anonymous (no login required)
- **Test Access:** Public, zero friction
- **Result Persistence:** URL-based (unique ID per completion)
- **Sharing:** Open Graph meta tags for social previews

### Technical Architecture
- **Framework:** Next.js 15 App Router
- **Rendering:** Static Site Generation (SSG)
- **Database:** Supabase PostgreSQL
- **Deployment:** DigitalOcean App Platform
- **Auto-deploy:** Git push triggers rebuild

### Test Management
- **Creation:** Admin-only via web dashboard
- **Publishing:** Manual approval before going live
- **Deployment:** Git commit + automatic rebuild

## Page Structure

### 1. Home Page `/`
**Rendering:** SSG
**Content:**
- Hero section with featured test
- Category sections
- Popular tests grid
- Simple, clean layout

**To be designed** (not in Figma)

### 2. Test Detail & Play `/tests/[slug]`
**Rendering:** SSG (pre-rendered at build time)
**Behavior:** Single page with state transitions

**Initial State - Test Introduction:**
- Sparkle emoji icon (✨) in rounded mint background
- Test title (large heading)
- Description (2-3 lines)
- Meta info: "10개의 질문 • 약 2분 소요"
- Primary CTA: "시작하기" (mint green button)
- Secondary link: "버튼 디자인 가이드 보기" (optional)

**Active State - Question Flow:**
- Progress indicator: "Step X of 10" + progress bar (mint green)
- Question text (h2, centered)
- 4 option cards:
  - White background with border
  - Label (A/B/C/D) in small circle
  - Option text
  - Hover state
  - Click triggers next question
- Client-side state management
- sessionStorage for progress persistence

**Screenshots:** See `.playwright-mcp/labs-design-01-intro.png`, `labs-design-02-question.png`

### 3. Results Page `/results/[id]`
**Rendering:** ISR (generated on-demand, cached forever)

**Layout:**
- Decorative sparkle elements (✨ scattered around)
- Large result image (colorful, eye-catching)
- 3 keyword tags in mint green pills: #키워드1 #키워드2 #키워드3
- Result title with emoji (h1)
- Result description (paragraph in rounded card)
- Two action buttons:
  - "링크 공유" (white with border + share icon)
  - "다시 해보기" (mint green + restart icon)
- Footer text: "2025 나의 키워드 찾기 ✨"

**Screenshot:** See `.playwright-mcp/labs-design-03-result.png`

### 4. Admin Dashboard `/admin/*`
**Rendering:** Dynamic (authenticated)

**Pages:**
- `/admin/login` - Password authentication
- `/admin` - Test list dashboard
- `/admin/tests/new` - Create new test
- `/admin/tests/[id]/edit` - Edit test
  - Basic info tab
  - Questions management (add/edit/delete/reorder)
  - Results management
  - Score matrix (assign points per option → result)

**To be designed** (not in Figma)

## Design System

### Colors
```css
/* Primary */
--color-primary: #00A67E;  /* Mint/Teal Green */
--color-primary-hover: #008F6D;

/* Backgrounds */
--color-bg-main: #FAFAFA;
--color-bg-card: #FFFFFF;
--color-bg-secondary: #F5F5F5;

/* Text */
--color-text-primary: #1A1A1A;
--color-text-secondary: #666666;
--color-text-tertiary: #999999;

/* Borders */
--color-border: #E0E0E0;
--color-border-active: var(--color-primary);
```

### Typography
```css
/* Font Family */
--font-primary: 'Pretendard', -apple-system, sans-serif;

/* Sizes */
--text-xs: 12px;   /* Meta info */
--text-sm: 14px;   /* Body small */
--text-base: 16px; /* Body */
--text-lg: 18px;   /* Emphasis */
--text-xl: 24px;   /* Section heading */
--text-2xl: 32px;  /* Page heading */
--text-3xl: 40px;  /* Hero */

/* Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```css
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

### Border Radius
```css
--radius-sm: 8px;   /* Small cards */
--radius-md: 12px;  /* Buttons, inputs */
--radius-lg: 16px;  /* Large cards */
--radius-xl: 24px;  /* Images */
--radius-full: 9999px; /* Pills, icons */
```

### Layout
- **Max Width:** 640px (mobile-first, centered)
- **Padding:** 20px horizontal on mobile
- **Vertical Rhythm:** Consistent 24px spacing between sections

### Components

**Button - Primary:**
```
Background: Mint green
Text: White, medium weight
Padding: 14px 32px
Border radius: 12px
Hover: Slightly darker
Icon: Optional (leading or trailing)
```

**Button - Secondary:**
```
Background: White
Border: 1px solid #E0E0E0
Text: Dark gray
Padding: 14px 32px
Border radius: 12px
Hover: Border color darkens
```

**Option Card:**
```
Background: White
Border: 1px solid #E0E0E0
Padding: 16px 20px
Border radius: 12px
Hover: Border → mint green, subtle shadow
Layout: Flex (label circle + text)
```

**Tag/Pill:**
```
Background: Transparent
Border: 1px solid mint green
Text: Mint green
Padding: 6px 16px
Border radius: 9999px
Font size: 14px
```

**Progress Bar:**
```
Background: #E0E0E0
Fill: Mint green
Height: 4px
Border radius: 2px
Smooth transition
```

## Data Model

### Core Tables

**labs.tests**
```sql
id            uuid PRIMARY KEY
title         text           -- "2025 나의 키워드 3개 찾기"
slug          text UNIQUE    -- "2025-keyword-check"
description   text
thumbnail     text           -- OG image URL
is_published  boolean        -- Show in build?
created_at    timestamptz
```

**labs.questions**
```sql
id            uuid PRIMARY KEY
test_id       uuid REFERENCES tests
text          text           -- "올해의 나는 ___ 시간에 가장 집중했다."
order_index   integer        -- Display order
```

**labs.question_options**
```sql
id            uuid PRIMARY KEY
question_id   uuid REFERENCES questions
text          text           -- "일이나 목표"
points        jsonb          -- {"result_uuid_1": 2, "result_uuid_2": 0, ...}
order_index   integer
```

**labs.results**
```sql
id               uuid PRIMARY KEY
test_id          uuid REFERENCES tests
title            text           -- "나만의 페이스로 산 한 해 🎭"
keywords         text[]         -- ["집중", "성장", "안정"]
description      text
image_url        text           -- Colorful result image
share_description text          -- For Open Graph
```

**labs.test_results** (User completions)
```sql
id           uuid PRIMARY KEY    -- Used in URL: /results/[id]
test_id      uuid REFERENCES tests
result_id    uuid REFERENCES results
answers      jsonb               -- {"q1_id": "option1_id", ...}
created_at   timestamptz         -- For analytics
```

### Result Calculation Logic

**Points Assignment:**
Each option assigns points directly to specific results:

```javascript
// Example option.points structure
{
  "result_uuid_A": 2,  // Strong match
  "result_uuid_B": 1,  // Weak match
  "result_uuid_C": 0,  // No match
  "result_uuid_D": 0
}
```

**Calculation Flow:**
1. User submits all answers
2. For each answer, fetch the selected option's `points` object
3. Accumulate points for each result:
   ```javascript
   const scores = {};
   answers.forEach(answer => {
     const option = getOption(answer.optionId);
     Object.entries(option.points).forEach(([resultId, points]) => {
       scores[resultId] = (scores[resultId] || 0) + points;
     });
   });
   ```
4. Find result with highest score
5. Handle ties: prioritize by result `order_index`

**Database Query:**
```typescript
// Server Action: submitTest()
async function submitTest(testId: string, answers: Record<string, string>) {
  // 1. Get all selected options with their points
  const options = await db.query(`
    SELECT points FROM question_options WHERE id = ANY($1)
  `, [Object.values(answers)]);

  // 2. Calculate scores
  const scores = calculateScores(options);

  // 3. Find winning result
  const winningResultId = getHighestScore(scores);

  // 4. Save to test_results
  const resultId = crypto.randomUUID();
  await db.query(`
    INSERT INTO test_results (id, test_id, result_id, answers, created_at)
    VALUES ($1, $2, $3, $4, NOW())
  `, [resultId, testId, winningResultId, answers]);

  // 5. Redirect
  redirect(`/results/${resultId}`);
}
```

## Data Flow

### SSG Build Process
1. Fetch all `is_published=true` tests from database
2. Generate static pages:
   - `/` (home)
   - `/tests/[slug]` (for each test)
3. Deploy to DigitalOcean

### Test Taking Flow
1. User visits `/tests/2025-keyword-check` (SSG page)
2. Sees introduction, clicks "시작하기"
3. React state switches to question mode (CSR)
4. User answers all questions (stored in component state)
5. On completion → Server Action `submitTest()`
6. Server calculates result, saves to DB, returns UUID
7. Redirect to `/results/[uuid]`
8. Result page generates on-demand (ISR), cached forever

### Admin Publishing Flow
1. Admin logs into `/admin`
2. Creates new test via `/admin/tests/new`
3. Sets `is_published=false` initially
4. Previews test
5. When ready → clicks "발행" button
6. Server Action:
   ```typescript
   await db.query('UPDATE tests SET is_published=true WHERE id=$1', [testId]);
   exec('git commit --allow-empty -m "Deploy: New test published"');
   exec('git push origin main');
   ```
7. DigitalOcean detects push → triggers rebuild
8. New test appears on site after ~2-3min

## SEO & Sharing

### Open Graph Meta Tags

**Test Pages:**
```typescript
// app/tests/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const test = await getTest(params.slug);
  return {
    title: test.title,
    description: test.description,
    openGraph: {
      title: test.title,
      description: test.description,
      images: [{ url: test.thumbnail }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: test.title,
      description: test.description,
      images: [test.thumbnail],
    },
  };
}
```

**Result Pages:**
```typescript
// app/results/[id]/page.tsx
export async function generateMetadata({ params }) {
  const result = await getTestResult(params.id);
  return {
    title: `나는 '${result.title}'!`,
    description: result.share_description,
    openGraph: {
      title: result.title,
      description: result.share_description,
      images: [{ url: result.image_url }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
```

### Analytics Requirements
- Google Analytics 4 (required by turtle-tail org)
- Microsoft Clarity (required)
- Google Search Console (required)
- Naver Search Advisor (required for Korean content)

### SEO Files
- `sitemap.xml` - Auto-generated from published tests
- `robots.txt` - Allow all crawlers
- Structured data (JSON-LD) for better search results

## Component Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with analytics
│   ├── page.tsx                   # Home page (SSG)
│   ├── tests/
│   │   └── [slug]/
│   │       ├── page.tsx           # Test detail + play (SSG)
│   │       └── actions.ts         # submitTest Server Action
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx           # Result page (ISR)
│   └── admin/
│       ├── layout.tsx             # Admin auth wrapper
│       ├── login/page.tsx
│       ├── page.tsx               # Dashboard
│       └── tests/
│           ├── new/page.tsx
│           └── [id]/edit/page.tsx
├── components/
│   ├── ui/                        # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Tag.tsx
│   ├── test/
│   │   ├── TestIntro.tsx          # Introduction screen
│   │   ├── QuestionFlow.tsx       # Question + options
│   │   └── OptionCard.tsx
│   ├── result/
│   │   ├── ResultDisplay.tsx
│   │   └── ShareButtons.tsx
│   └── admin/
│       ├── TestEditor.tsx
│       ├── QuestionEditor.tsx
│       └── ScoreMatrix.tsx        # Points assignment UI
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   └── server.ts              # Server client
│   ├── actions/
│   │   ├── test-actions.ts        # submitTest, etc.
│   │   └── admin-actions.ts       # CRUD operations
│   └── utils/
│       ├── calculate-result.ts    # Score calculation logic
│       └── deploy.ts              # Git push helper
└── types/
    └── database.ts                # TypeScript types from DB
```

## Error Handling

**404 Cases:**
- Test slug not found → `not-found.tsx`
- Result ID not found → `not-found.tsx`
- Admin page without auth → redirect to login

**Result Calculation Edge Cases:**
- Tie in scores → use result with lowest `order_index`
- Missing data → show generic/default result
- Incomplete answers → prevent submission (validate on client)

**Admin Protection:**
- Environment variable `ADMIN_PASSWORD`
- JWT or session cookie
- Middleware checks auth before rendering `/admin/*`

## Performance Optimization

**Images:**
- Use Next.js `<Image>` component
- Optimize result images (WebP format)
- Lazy load below-the-fold content

**Fonts:**
- Use `next/font` for Pretendard
- Preload font files
- Subset Korean characters

**JavaScript:**
- Dynamic import for admin pages
- Minimize client bundle
- Server Components by default

**Caching Strategy:**
- Test pages: Static (revalidate on deploy)
- Result pages: ISR (cache forever)
- API: No caching needed (Server Actions)

## Deployment Configuration

**DigitalOcean App Platform:**
```yaml
name: labs
region: sgp  # Singapore for Korean users
static_sites:
  - name: labs-web
    github:
      repo: turtle-tail/labs
      branch: main
      deploy_on_push: true
    build_command: npm run build
    output_dir: .next
    environment_variables:
      - SUPABASE_URL
      - SUPABASE_ANON_KEY
      - ADMIN_PASSWORD
```

**Environment Variables:**
```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx

# Admin
ADMIN_PASSWORD=xxx (strong password)

# Analytics (from turtle-tail org)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxx
```

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- Database schema setup
- Supabase connection
- Basic SSG pages (home, test detail)
- TypeScript types generation

### Phase 2: Test Flow (Week 2)
- Question component with state management
- Progress bar
- Result calculation logic
- Server Action for submission
- Result page (ISR)

### Phase 3: Admin Dashboard (Week 2-3)
- Authentication
- Test CRUD UI
- Question editor
- Score matrix builder
- Deploy trigger integration

### Phase 4: Polish & SEO (Week 3)
- Open Graph meta tags
- Analytics integration
- Sitemap generation
- Mobile optimization
- Performance tuning

### Phase 5: Launch (Week 4)
- Domain setup
- SSL configuration
- Monitoring setup
- First test content creation

## Success Metrics

**Technical:**
- Lighthouse score > 90 (all categories)
- Time to Interactive < 2s
- Zero layout shift (CLS = 0)

**Product:**
- Share rate > 30% (users who click share button)
- Completion rate > 80% (users who finish test)
- Return rate > 10% (users who take multiple tests)

## Risk Mitigation

**Viral Traffic Spike:**
- SSG ensures no database overload
- Only result generation hits DB (ISR cached)
- Consider Supabase connection pooling

**Spam/Abuse:**
- Rate limiting on result creation
- Cloudflare CDN for DDoS protection
- No user-generated content (admin-only)

**Data Privacy:**
- No PII collected (fully anonymous)
- Result IDs are random UUIDs (not guessable)
- GDPR compliant (no cookies except analytics)

## Future Enhancements

**v2 Features (Post-MVP):**
- Multiple test categories
- Dynamic image generation for results
- Instagram story templates
- A/B testing for questions
- Analytics dashboard for admins
- Test templates for faster creation

**Potential Monetization:**
- Sponsored tests
- Premium result images
- White-label for brands

---

## Appendix

**Design References:**
- Figma Published Site: https://script-neon-67078207.figma.site
- Screenshots: `.playwright-mcp/labs-design-*.png`

**Related Documents:**
- Database schema: `database/schema.sql`
- Turtle-tail org guidelines: `.claude/CLAUDE.md`

**External Dependencies:**
- Supabase: PostgreSQL database
- DigitalOcean: Hosting & deployment
- GitHub: Version control & CI/CD trigger
