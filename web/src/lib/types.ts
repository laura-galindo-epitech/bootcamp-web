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

export type CustomerInfo = {
    firstName:string
    lastName:string
    email:string
    phone?:string
    address:string
    zip:string
    city:string
    country:string
}

export type OrderItem = CartItem

export type Order = {
    id:string
    number:string
    status:'paid'
    items:OrderItem[]
    total:number
    customer:CustomerInfo
    createdAt:string
}