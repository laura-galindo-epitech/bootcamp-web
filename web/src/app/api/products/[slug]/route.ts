import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Use /products/[slug] page for rendering.' }, { status: 200 })
}
