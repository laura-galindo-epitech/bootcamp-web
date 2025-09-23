"use client"
import DeleteAccount from '@/components/account/DeleteAccount'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'

async function exportPersonalData() {
  try {
    const res = await fetch('/api/me/export')
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Export impossible' }))
      throw new Error(error || 'Export impossible')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mes-donnees.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export RGPD échoué', error)
    alert("L'export n'a pas pu être généré. Réessaie plus tard ou contacte le support RGPD.")
  }
}

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return
      setEmail(user?.email || '')
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight">Paramètres</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Mettez à jour vos informations personnelles et vos préférences.</p>

      <div className="mt-6 grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nom complet</label>
          <input className="w-full rounded-md border px-3 py-2 bg-white dark:bg-zinc-900" placeholder="Ex: Jane Doe" />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Adresse e‑mail</label>
          <input
            type="email"
            value={loading ? '' : email}
            readOnly
            className="w-full rounded-md border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {loading ? 'Chargement…' : (email ? 'Connecté avec cette adresse.' : 'Aucune session détectée.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Enregistrer</button>
          <Link href="/account/security" className="text-sm underline text-zinc-700 dark:text-zinc-300">
            Modifier mon mot de passe
          </Link>
        </div>
      </div>

      <section className="mt-8 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Droit d’accès & portabilité</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Téléchargez une copie lisible de vos informations (profil, commandes) au format texte. Vous pourrez la partager
            avec un autre service si besoin.
          </p>
        </div>
        <button
          type="button"
          onClick={exportPersonalData}
          className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Exporter mes données (.txt)
        </button>
      </section>

      <DeleteAccount />
    </div>
  )
}
