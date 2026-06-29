import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const DEV_EMAIL = 'dev@localhost.local'

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 })
  }

  const { origin } = await req.json().catch(() => ({ origin: 'http://localhost:3001' }))

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const res = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
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

  const body = await res.json()
  if (!res.ok) return NextResponse.json({ restError: body, httpStatus: res.status }, { status: 500 })
  return NextResponse.json({ url: body.action_link })
}
