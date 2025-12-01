# Deployment Guide - Labs Project

## Vercel Deployment

### 1. Vercel 프로젝트 생성

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 프로젝트 배포
vercel
```

또는 **Vercel Dashboard**에서:
1. https://vercel.com/new
2. GitHub 저장소 연결: `turtle-tail/labs`
3. Framework Preset: **Next.js** (자동 감지)
4. Root Directory: `./`
5. Deploy 클릭

### 2. 환경 변수 설정

Vercel Dashboard → 프로젝트 → **Settings** → **Environment Variables**

#### Required Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rrbynxigntmhgazlzjff.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://labs.turtle-tail.com` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://labs-preview.vercel.app` | Preview |

#### Optional (Analytics):

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Production |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | `your-clarity-id` | Production |

### 3. 도메인 설정

Vercel Dashboard → 프로젝트 → **Settings** → **Domains**

- Production: `labs.turtle-tail.com`
- DNS 설정 (Cloudflare/DigitalOcean):
  - Type: `CNAME`
  - Name: `labs`
  - Value: `cname.vercel-dns.com`

### 4. 빌드 설정

**Framework**: Next.js
**Build Command**: `pnpm build`
**Output Directory**: `.next`
**Install Command**: `pnpm install`
**Node Version**: 20.x

### 5. 배포 확인

- Production: https://labs.turtle-tail.com
- Vercel URL: https://labs-turtle-tail.vercel.app

---

## 로컬 개발

```bash
# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 수정 (Supabase 키 입력)

# direnv 사용시 (권장)
direnv allow

# 개발 서버 실행
pnpm dev
```

---

## 환경별 설정

### Development (로컬)
- `.env.local` + `.envrc` 사용
- Hot reload 활성화
- Source maps 포함

### Preview (Vercel)
- Pull Request별 자동 배포
- Preview URL 자동 생성
- Production과 동일한 환경 변수

### Production (Vercel)
- `main` 브랜치 자동 배포
- 커스텀 도메인 사용
- Analytics 활성화
