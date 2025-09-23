'use client';

import React from "react"
import { useEffect, useState } from 'react'

export default function Hero() {
    const images = [
        '/images/hero-shoe.jpg',
        '/images/hero-2.jpg',
        '/images/hero-3.jpg'
    ]
    const [i, setI] = useState(0)

    useEffect(() => {
        if(images.length <= 1) return
        const id = setInterval(() => setI((p) => (p + 1) % images.length), 4000)
        return () => clearInterval(id)
    }, [images.length])

    return (
        <section className="relative overflow-hidden min-h-[calc(100vh-56px)]">
            <div className="absolute inset-0">
                {images.map((src, idx) => (
                    <div
                        key={src}
                        style={{ backgroundImage: `url(${src})` }}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${idx === i ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

            {/* Navigation arrows */}
            <button
                type="button"
                aria-label="Image précédente"
                onClick={() => setI((p) => (p - 1 + images.length) % images.length)}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/70 hover:bg-white text-black shadow flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black/30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
            <button
                type="button"
                aria-label="Image suivante"
                onClick={() => setI((p) => (p + 1) % images.length)}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white/70 hover:bg-white text-black shadow flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black/30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                </svg>
            </button>

            {/* Pagination dots */}
            <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        aria-label={`Aller à l'image ${idx + 1}`}
                        onClick={() => setI(idx)}
                        className={`h-2.5 w-2.5 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/80 ${
                            idx === i
                                ? 'bg-white border-white'
                                : 'bg-white/40 border-white/70 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
            <div className="relative z-10 mx-auto max-w-6xl px-4 min-h-[calc(100vh-56px)] grid md:grid-cols-2 items-center">
                <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-50">Nouvelle collection</p>
                    <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight text-zinc-50">Move. Breathe. Repeat.</h1>
                    <p className="mt-3 text-zinc-50 max-w-prose">Des modèles sélectionnés pour la course, le training et le quotidien. Confort, légèreté, durabilité.</p>
                    <div className="mt-6 flex items-center gap-3">
                        <a href="/products" className="inline-flex items-center rounded-full bg-blue-700 px-6 py-3 text-white hover:opacity-90">Acheter maintenant</a>
                        <a href="#categories" className="inline-flex items-center rounded-full px-6 py-3 bg-white/80 backdrop-blur hover:opacity-90">Parcourir</a>
                    </div>
                </div>
            </div>
        </section>
    )
}
