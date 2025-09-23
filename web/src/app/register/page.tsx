'use client'
import { useState, FormEvent } from 'react'
import { supabase } from '@/utils/supabase/client'
import Link from 'next/link'
import { PrivacyHint } from '@/components/PrivacyHint'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!email || !password) {
      setMessage('Email et mot de passe requis.')
      return
    }
    if (password !== confirm) {
      setMessage('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      setMessage(error.message)
      return
    }
    if (data.session) {
      window.location.href = '/account'
    } else {
      setMessage('Compte créé. Vérifie tes emails pour confirmer ton adresse.')
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-10 space-y-5">
      <h1 className="text-xl font-semibold">Créer un compte</h1>
<<<<<<< HEAD
      <PrivacyHint context="register" />
=======
>>>>>>> 0a5ce0440fa38f00eabec6911c4f416134f330da
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="vous@exemple.com"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <button disabled={loading} type="submit" className="w-full rounded-full bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-50">
          {loading ? 'Création…' : 'Créer mon compte'}
        </button>
        {message && <p className="text-sm text-zinc-600">{message}</p>}
      </form>

      <p className="text-sm text-zinc-600">
        Déjà un compte ?{' '}
        <Link href="/login" className="underline">Se connecter</Link>
      </p>
    </section>
  )
}
<<<<<<< HEAD
=======

>>>>>>> 0a5ce0440fa38f00eabec6911c4f416134f330da
