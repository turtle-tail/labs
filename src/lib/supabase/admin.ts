import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

/**
 * Admin client for build-time data fetching
 * This client doesn't require cookies and can be used in generateStaticParams
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: 'labs' },
    }
  )
}
