type Props = { params: { number: string } }

export default function OrderDetailPage({ params }: Props) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight">Commande n° {params.number}</h2>
      <p className="mt-2 text-zinc-600">Détails de la commande à venir.</p>
    </div>
  )
}
