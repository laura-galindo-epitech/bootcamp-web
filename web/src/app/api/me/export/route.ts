import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (_) {}
        }
      }
    }
  )
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
  }
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  let appUserId: number | null = null

  // Try to map auth user to app users table (mirrors delete logic)
  try {
    const { data } = await supabaseAdmin
      .from('users')
      // @ts-ignore optional column
      .select('id')
      .eq('auth_uid', user.id)
      .maybeSingle()
    if (data?.id) appUserId = data.id
  } catch (_) {}

  if (appUserId == null && user.email) {
    try {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()
      if (data?.id) appUserId = data.id
    } catch (_) {}
  }

  const [profileRes, ordersRes] = await Promise.all([
    appUserId != null
      ? supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', appUserId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    appUserId != null
      ? supabaseAdmin
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', appUserId)
      : Promise.resolve({ data: [], error: null })
  ])

  if (profileRes.error || ordersRes.error) {
    console.error('Export data error', profileRes.error, ordersRes.error)
    return NextResponse.json({ error: 'Export impossible pour le moment' }, { status: 500 })
  }

  const lines: string[] = []
  lines.push('=== Données personnelles OneShoe ===')
  lines.push(`Exporté le : ${new Date().toLocaleString('fr-FR')}`)
  lines.push('')
  lines.push('[Compte]')
  lines.push(`- Identifiant Supabase : ${user.id}`)
  lines.push(`- Adresse e-mail : ${user.email ?? '—'}`)
  lines.push('')
  lines.push('[Profil boutique]')
  if (profileRes.data) {
    const profile = profileRes.data as Record<string, any>
    Object.entries(profile).forEach(([key, value]) => {
      if (value === null || typeof value === 'undefined') return
      lines.push(`- ${key} : ${String(value)}`)
    })
  } else {
    lines.push('Aucun profil enregistré sur la boutique.')
  }

  const orders = (ordersRes.data ?? []) as Record<string, any>[]
  lines.push('')
  lines.push(`[Commandes] (${orders.length})`)
  if (orders.length === 0) {
    lines.push('Aucune commande enregistrée.')
  } else {
    orders.forEach((order, index) => {
      lines.push(`- Commande #${index + 1}`)
      Object.entries(order).forEach(([key, value]) => {
        if (key === 'order_items') return
        if (value === null || typeof value === 'undefined') return
        lines.push(`    · ${key} : ${String(value)}`)
      })
      if (Array.isArray(order.order_items) && order.order_items.length > 0) {
        lines.push('    · Articles :')
        order.order_items.forEach((item: Record<string, any>, idx: number) => {
          const label = item.product_name ?? item.sku ?? `Article ${idx + 1}`
          lines.push(`        - ${label}`)
          Object.entries(item).forEach(([key, value]) => {
            if (key === 'product_name' || value === null || typeof value === 'undefined') return
            lines.push(`            · ${key} : ${String(value)}`)
          })
        })
      }
    })
  }

  lines.push('')
  lines.push('Pour exercer vos autres droits (rectification, suppression), contactez dpo@onesshoe.com.')

  const body = lines.join('\n')

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mes-donnees.txt"'
    }
  })
}
