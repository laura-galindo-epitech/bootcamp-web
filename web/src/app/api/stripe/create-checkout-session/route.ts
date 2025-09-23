import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'STRIPE_SECRET_KEY missing' }, { status: 500 })
  const stripe = new Stripe(secret)

  const { email, returnUrl } = await req.json().catch(() => ({}))
  if (!email || !returnUrl) return NextResponse.json({ error: 'email and returnUrl are required' }, { status: 400 })

  try {
    // Find or create a customer by email (simple approach without persisting the id yet)
    const list = await stripe.customers.list({ email, limit: 1 })
    const customer = list.data[0] ?? (await stripe.customers.create({ email }))

    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      customer: customer.id,
      payment_method_types: ['card'],
      success_url: `${returnUrl}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?status=cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Stripe error' }, { status: 500 })
  }
}

