'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onDelete = async () => {
    if (!confirm('Confirmer la suppression définitive de votre compte ?')) return
    setLoading(true)
    setMessage(null)
    // Récupérer le token d'accès pour authentifier la requête côté serveur
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData.session?.access_token
    const res = await fetch('/api/account/delete', {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
    const body = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) {
      setMessage(body.error || 'Erreur lors de la suppression')
      return
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-sm font-medium text-red-600">Zone dangereuse</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Supprime définitivement votre compte et vos données associées.</p>
      <button
        onClick={onDelete}
        disabled={loading}
        className="mt-3 inline-flex items-center rounded-md bg-red-600 text-white px-4 py-2 hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Suppression…' : 'Supprimer mon compte'}
      </button>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
    </div>
  )
}
