import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { createClient as createCoreClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  // 1) Tenter via cookies (SSR)
  const supabase = await createClient()
  let { data: { user } } = await supabase.auth.getUser()

  // 2) Fallback: token envoyé par le client
  if (!user) {
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null
    if (token) {
      const anon = createCoreClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      )
      const { data } = await anon.auth.getUser(token)
      user = data.user ?? null
    }
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Try to find app user id (public.users)
    let appUserId: number | null = null

    try {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('auth_uid', user.id)
        .maybeSingle()
      if (data?.id) appUserId = data.id
    } catch (_) {
    }

    // Fallback: via email
    if (appUserId == null && user.email) {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()
      if (data?.id) appUserId = data.id
    }

    if (appUserId != null) {
      await supabaseAdmin.from('shopping_carts').delete().eq('user_id', appUserId)
      await supabaseAdmin.from('product_reviews').delete().eq('user_id', appUserId)
      await supabaseAdmin.from('user_sessions').delete().eq('user_id', appUserId)
      await supabaseAdmin.from('orders').delete().eq('user_id', appUserId)
      await supabaseAdmin.from('users').delete().eq('id', appUserId)
    }

    // Delete auth user
    await supabaseAdmin.auth.admin.deleteUser(user.id)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Delete account failed', e)
    return NextResponse.json({ error: e?.message || 'Delete failed' }, { status: 500 })
  }
}
