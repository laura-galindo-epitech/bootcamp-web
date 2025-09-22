'use client'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'
import { PrivacyHint } from '@/components/PrivacyHint'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [credEmail, setCredEmail] = useState('')
  const [credPassword, setCredPassword] = useState('')
  const [credLoading, setCredLoading] = useState(false)
  const [credMessage, setCredMessage] = useState<string | null>(null)

  const sendMagicLink = async (e: FormEvent) => {
    e.preventDefault()
    // Optionnel: si tu ajoutes SMTP côté Supabase, tu peux déclencher un magic link ici
    // await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
  }

  const signInWithCredentials = async (e: FormEvent) => {
    e.preventDefault()
    setCredMessage(null)
    if (!credEmail || !credPassword) {
      setCredMessage('Email et mot de passe requis.')
      return
    }
    setCredLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: credEmail.trim(), password: credPassword })
    setCredLoading(false)
    if (error) {
      console.error('Login error:', error)
      setCredMessage(error.message)
      return
    }
    window.location.href = '/account'
  }

  const signInWithGoogleSupabase = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-10 space-y-5">
      <h1 className="text-xl font-semibold">Connexion</h1>
      <p className="text-sm text-zinc-600">Choisissez une méthode de connexion</p>
      <PrivacyHint context="login" />

      <div className="space-y-2">
        {/* Supabase Auth Google */}
        <button
          onClick={signInWithGoogleSupabase}
          className="w-full rounded-full bg-red-600 text-white px-4 py-2 hover:opacity-90"
        >
          Continuer avec Google
        </button>
      </div>

      <form onSubmit={signInWithCredentials} className="space-y-2 border-t pt-4">
        <label className="block text-sm">Email + mot de passe</label>
        <input
          type="email"
          value={credEmail}
          onChange={(e) => setCredEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="password"
          value={credPassword}
          onChange={(e) => setCredPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded border px-3 py-2"
        />
        <button disabled={credLoading} type="submit" className="w-full rounded-full bg-zinc-800 text-white px-4 py-2 hover:opacity-90 disabled:opacity-50">
          {credLoading ? 'Connexion…' : 'Se connecter'}
        </button>
        {credMessage && <p className="text-sm text-red-600">{credMessage}</p>}
      </form>

      <p className="text-sm text-zinc-600">
        Pas de compte ?{' '}
        <Link href="/register" className="underline">Créer un compte</Link>
      </p>
    </section>
  )
}
