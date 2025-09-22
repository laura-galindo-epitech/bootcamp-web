import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY missing' }, { status: 500 })
  }
  const stripe = new Stripe(secret, { apiVersion: '2024-06-20' })
  const body = await req.json().catch(() => ({}))
  const id = body?.paymentMethodId as string | undefined
  if (!id) return NextResponse.json({ error: 'paymentMethodId required' }, { status: 400 })
  try {
    const pm = await stripe.paymentMethods.retrieve(id)
    const card = (pm.card as any) || {}
    return NextResponse.json({
      id: pm.id,
      brand: card.brand || null,
      last4: card.last4 || null,
      exp_month: card.exp_month || null,
      exp_year: card.exp_year || null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Stripe error' }, { status: 500 })
  }
}

