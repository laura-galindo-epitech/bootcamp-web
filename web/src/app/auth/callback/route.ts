import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const next = url.searchParams.get('next') || '/account'

  const supabase = await createClient()
  // Échange le code présent dans l'URL (PKCE) contre une session et cookies côté serveur
  await supabase.auth.exchangeCodeForSession(url.toString())

  return NextResponse.redirect(new URL(next, origin))
}
