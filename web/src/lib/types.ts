export type Gender = 'men' | 'women' | 'kids'
export type Size = '36'|'37'|'38'|'39'|'40'|'41'|'42'|'43'|'44'

export type ProductVariant = {
    id: string
    size: Size
    stock: number
    price: number // en cents
}

export type Product = {
    id: string
    slug: string
    name: string
    brand: string
    gender: Gender
    category: 'sneakers' | 'running' | 'basketball'
    description: string
    images: string[]
    variants: ProductVariant[]
}

export type CartItem = {
    productId: string
    variantId: string
    name: string
    image: string
    size: Size
    quantity: number
    unitPrice: number // cents
}