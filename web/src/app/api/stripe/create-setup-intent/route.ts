import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY missing' }, { status: 500 })
  }
  const stripe = new Stripe(secret, { apiVersion: '2024-06-20' })
  try {
    const si = await stripe.setupIntents.create({ payment_method_types: ['card'] })
    return NextResponse.json({ clientSecret: si.client_secret })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Stripe error' }, { status: 500 })
  }
}

