import OrderContent from '@/components/OrderContent'

interface OrderPageProps {
  params: {
    number: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  return <OrderContent orderNumber={params.number} />
}