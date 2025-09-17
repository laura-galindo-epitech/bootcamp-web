import { Product } from './types'

export async function fetchProducts(params: { search?: string; gender?: string; category?: string } = {}) {
    const query = new URLSearchParams(params as any).toString()
    const res = await fetch(`/api/products${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return (await res.json()) as { items: Product[]; total: number }
}

export async function createCheckout(payload: unknown) {
    const res = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error('Checkout failed')
    return res.json()
}