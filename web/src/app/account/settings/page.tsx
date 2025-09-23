"use client"
import DeleteAccount from '@/components/account/DeleteAccount'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'

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

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Enregistrer</button>
          <Link href="/account/security" className="text-sm underline text-zinc-700 dark:text-zinc-300">
            Modifier mon mot de passe
          </Link>
        </div>
      </div>

      <DeleteAccount />
    </div>
  )
}
