const CATEGORIES = [
{ key: 'running', title: 'Running', img: '/images/cat-running.jpg' },
{ key: 'sneakers', title: 'Lifestyle', img: '/images/cat-lifestyle.jpg' },
{ key: 'basketball', title: 'Basketball', img: '/images/cat-basket.jpg' },
]

export default function CategoryCards() {
    return (
        <section id="categories" className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-lg font-semibold mb-4">Catégories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CATEGORIES.map(c => (
                    <a key={c.key} href={`/products?category=${c.key}`} className="group block rounded-2xl overflow-hidden border bg-white">
                        <div className="aspect-[3/2]">
                            <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                        </div>
                        <div className="p-3">
                            <div className="font-medium">{c.title}</div>
                            <div className="text-sm text-zinc-500">Découvrir</div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}