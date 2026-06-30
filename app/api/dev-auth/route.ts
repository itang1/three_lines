import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const DEV_EMAIL = 'dev@localhost.local'

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 })
  }

  const { origin } = await req.json().catch(() => ({ origin: 'http://localhost:3000' }))

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Generate a one-time magic link (creates user if they don't exist)
  const linkRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      type: 'magiclink',
      email: DEV_EMAIL,
      redirect_to: `${origin}/notebook/john/1`,
    }),
  })

  const linkBody = await linkRes.json()
  if (!linkRes.ok) {
    return NextResponse.json({ error: `Supabase: ${linkBody.msg ?? JSON.stringify(linkBody)}` }, { status: 500 })
  }

  // Ensure the profile row exists (trigger may have silently failed)
  // Note: generate_link returns the user object flat at the top level, not nested under "user"
  const userId = linkBody.id
  if (userId) {
    await admin.from('profiles').upsert({
      id: userId,
      display_name: 'Dev User',
      preferred_translation: 'ESV',
      notes_public_default: false,
      is_admin: true,
    }, { onConflict: 'id' })
  }

  return NextResponse.json({ email: DEV_EMAIL, otp: linkBody.email_otp })
}
