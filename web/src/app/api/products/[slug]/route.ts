import { NextResponse } from 'next/server'

// This route is intentionally minimal. The app uses the SSR page
// at /products/[slug]. Keeping this route avoids build issues
// from having an invalid React component in an API file.

export async function GET() {
  return NextResponse.json({ message: 'Use /products/[slug] page for rendering.' }, { status: 200 })
}
