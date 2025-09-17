export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-500">Nouvelle collection</p>
                    <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Move. Breathe. Repeat.</h1>
                    <p className="mt-3 text-zinc-600">Des modèles sélectionnés pour la course, le training et le quotidien. Confort, légèreté, durabilité.</p>
                        <div className="mt-6 flex items-center gap-3">
                            <a href="/products" className="inline-flex items-center rounded-full bg-black px-5 py-2.5 text-white hover:opacity-90">Voir les produits</a>
                            <a href="#categories" className="inline-flex items-center rounded-full border px-5 py-2.5 hover:bg-zinc-50">Catégories</a>
                        </div>
                </div>
                <div className="aspect-square rounded-2xl border bg-white overflow-hidden">
                    <img src="/images/hero-shoe.jpg" alt="Hero" className="h-full w-full object-cover" />
                </div>
            </div>
        </section>
    )
}