'use client'
import { FormEvent, useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [credEmail, setCredEmail] = useState('')
  const [credPassword, setCredPassword] = useState('')

  const sendMagicLink = async (e: FormEvent) => {
    e.preventDefault()
    // Optionnel: si tu ajoutes SMTP côté Supabase, tu peux déclencher un magic link ici
    // await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
  }

  const signInWithCredentials = async (e: FormEvent) => {
    e.preventDefault()
    if (!credEmail || !credPassword) return
    const { error } = await supabase.auth.signInWithPassword({ email: credEmail, password: credPassword })
    if (!error) {
      window.location.href = '/'
    }
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
        <button type="submit" className="w-full rounded-full bg-zinc-800 text-white px-4 py-2 hover:opacity-90">
          Se connecter
        </button>
        <p className="text-xs text-zinc-500">Astuce: définis AUTH_CREDENTIALS_EMAIL et AUTH_CREDENTIALS_PASSWORD dans .env pour activer ce mode, ou CREDENTIALS_DEV_ACCEPT_ANY=1 en dev.</p>
      </form>
    </section>
  )
}
