import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-only service-role client. Created lazily so a missing env var fails a
// single request (returning a clean 500) rather than throwing at import time
// and breaking the build. The service role bypasses RLS, so this must never be
// imported into a client component. Shared by every API route that needs
// privileged access, replacing the per-route module-level clients.
let _client: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return _client
}
