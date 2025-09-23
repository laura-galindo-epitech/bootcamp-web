"use client"

import { useState } from 'react'

const CONTACT_EMAIL = 'contact@onesshoe.com'

export default function ContactForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('Demande générale')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError('Merci de renseigner nom, email et message pour que nous puissions vous répondre.')
      return
    }

    const content = [
      `Nom : ${fullName}`,
      `Email : ${email}`,
      `Sujet : ${subject}`,
      '',
      message.trim()
    ].join('\n')

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[Contact OneShoe] ${subject}`)}&body=${encodeURIComponent(content)}`
    window.location.href = mailto
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-2">
        <label htmlFor="fullName" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Nom et prénom *</label>
        <input
          id="fullName"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          autoComplete="name"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Ex : Marie Dupont"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Adresse e‑mail *</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="vous@exemple.com"
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="subject" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Sujet</label>
        <select
          id="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option>Demande générale</option>
          <option>À propos d’une commande</option>
          <option>Question RGPD / données personnelles</option>
          <option>Partenariat / presse</option>
          <option>Autre</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Message *</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Expliquez-nous votre demande…"
          required
        />
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Les informations saisies servent uniquement à répondre à votre demande. Consultez notre{' '}
        <a className="underline" href="/privacy">Politique de confidentialité</a> pour en savoir plus.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Envoyer mon email
      </button>
    </form>
  )
}
