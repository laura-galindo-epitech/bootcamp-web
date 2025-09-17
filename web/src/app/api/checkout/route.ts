import { NextResponse } from 'next/server'
export async function POST(req: Request) {
    // Ici on simule un paiement OK et on “crée” une commande fictive
    const body = await req.json()
    const orderNumber = 'CMD-' + Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0')
    return NextResponse.json({ status: 'paid', orderNumber, received: body }, { status: 201 })
}