This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase TypeScript Types

This project uses Supabase for the database. TypeScript types are manually maintained in `src/lib/supabase/types.ts`.

### Generating Types (Future)

To auto-generate types from your Supabase database schema in the future:

1. Login to Supabase CLI:
```bash
npx supabase login
```

2. Generate types:
```bash
npm run types:generate
```

Or use the full command with your access token:
```bash
SUPABASE_ACCESS_TOKEN=your_token npm run types:generate
```

**Note:** Currently, types are manually maintained. The `types:generate` command requires Supabase CLI authentication.

### Type Structure

The Database interface follows Supabase's standard structure:
- `Row`: Database table row type
- `Insert`: Type for inserting new rows (auto-generated fields are optional)
- `Update`: Type for updating rows (all fields optional)
- `Relationships`: Foreign key relationships

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
