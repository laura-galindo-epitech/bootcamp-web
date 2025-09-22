import { NextResponse } from 'next/server'
export async function POST(req:Request){
    const { items, customer, total } = await req.json()
    if (!items?.length) return NextResponse.json({ error:'Panier vide' }, { status:400 })
    if (!customer?.email || !customer?.address) return NextResponse.json({ error:'Infos client manquantes' }, { status:400 })
    const orderNumber = 'CMD-'+Math.floor(Math.random()*1_000_000).toString().padStart(6,'0')
    return NextResponse.json({ orderNumber, total }, { status:201 })
}