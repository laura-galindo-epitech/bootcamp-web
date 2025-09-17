'use client'
import { create } from 'zustand'
import { CartItem } from '@/lib/types'

type CartState = {
    items: CartItem[]
    add: (item: CartItem) => void
    remove: (variantId: string) => void
    setQty: (variantId: string, qty: number) => void
    clear: () => void
}

export const useCart = create<CartState>((set) => ({
    items: [],
    add: (item) => set((s) => {
        const existing = s.items.find(i => i.variantId === item.variantId)
        if (existing) {
            return { items: s.items.map(i => i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i) }
        }
        return { items: [...s.items, item] }
    }),
    remove: (variantId) => set((s) => ({ items: s.items.filter(i => i.variantId !== variantId) })),
    setQty: (variantId, quantity) => set((s) => ({ items: s.items.map(i => i.variantId === variantId ? { ...i, quantity } : i) })),
    clear: () => set({ items: [] }),
}))