import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Pin the Database generic at the boundary. @supabase/ssr 0.3's
// createBrowserClient does not propagate it, and its bundled supabase-js
// SupabaseClient has a different generic arity than the hoisted one, so a
// single contained cast here gives every consumer a fully typed client.
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: 'implicit' } },
  ) as unknown as SupabaseClient<Database>
}
