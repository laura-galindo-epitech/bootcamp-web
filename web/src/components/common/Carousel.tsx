'use client'
import { useEffect, useMemo, useState } from 'react'

type Slide = { image: string; title?: string; subtitle?: string; ctaHref?: string; ctaLabel?: string }

export default function Carousel({ slides, interval=4000 }: { slides: Slide[]; interval?: number }) {
  const [i, setI] = useState(0)
  const n = slides.length
  const ids = useMemo(()=>slides.map((_,k)=>k),[slides])

  useEffect(()=>{
    const id = setInterval(()=> setI((p)=> (p+1)%n), interval)
    return ()=> clearInterval(id)
  },[n, interval])

  function go(k:number){ setI((k+n)%n) }

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative h-[60vh] md:h-[70vh]">
        {slides.map((s,idx)=> (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx===i? 'opacity-100':'opacity-0'}`}>
            <img src={s.image} alt={s.title||''} className="h-full w-full object-cover"/>
            {(s.title||s.subtitle||s.ctaHref) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"/>
            )}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 max-w-6xl w-[92%] text-center text-white">
              {s.title && <h2 className="text-2xl md:text-4xl font-semibold drop-shadow">{s.title}</h2>}
              {s.subtitle && <p className="mt-2 text-sm md:text-base opacity-90 drop-shadow">{s.subtitle}</p>}
              {s.ctaHref && (
                <a href={s.ctaHref} className="inline-flex mt-5 rounded-full bg-white/95 text-black px-6 py-2.5 hover:bg-white">{s.ctaLabel||'Découvrir'}</a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Flèches */}
      <button onClick={()=>go(i-1)} aria-label="Précédent" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white">‹</button>
      <button onClick={()=>go(i+1)} aria-label="Suivant" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white">›</button>

      {/* Puces */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {ids.map(k=> (
          <button key={k} onClick={()=>go(k)} className={`h-2.5 w-2.5 rounded-full ${k===i?'bg-black':'bg-black/30'}`} aria-label={`Aller au slide ${k+1}`}/>
        ))}
      </div>
    </section>
  )
}