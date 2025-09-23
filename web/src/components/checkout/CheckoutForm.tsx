'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PrivacyHint } from '@/components/PrivacyHint'

const Schema = z.object({ firstName:z.string().min(2), lastName:z.string().min(2), email:z.string().email(), address:z.string().min(5), zip:z.string().min(4), city:z.string().min(2), country:z.string().min(2), phone:z.string().optional() })
export type CheckoutData = z.infer<typeof Schema>

export default function CheckoutForm({ onSubmit }:{ onSubmit:(d:CheckoutData)=>void }){
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<CheckoutData>({ resolver: zodResolver(Schema) })
  return (
    <div className="space-y-3">
      <PrivacyHint context="checkout" />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="Prénom" {...register('firstName')} className="border rounded px-3 py-2"/>
          <input placeholder="Nom" {...register('lastName')} className="border rounded px-3 py-2"/>
        </div>
        <input placeholder="Email" {...register('email')} className="border rounded px-3 py-2"/>
        <input placeholder="Adresse" {...register('address')} className="border rounded px-3 py-2"/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="Code postal" {...register('zip')} className="border rounded px-3 py-2"/>
          <input placeholder="Ville" {...register('city')} className="border rounded px-3 py-2"/>
          <input placeholder="Pays" {...register('country')} className="border rounded px-3 py-2"/>
        </div>
        <input placeholder="Téléphone (optionnel)" {...register('phone')} className="border rounded px-3 py-2"/>
        {Object.keys(errors).length>0 && <p className="text-sm text-red-600">Merci de compléter les champs requis.</p>}
        <button disabled={isSubmitting} className="mt-2 inline-flex rounded bg-black text-white px-4 py-2">{isSubmitting? 'Traitement…':'Payer maintenant'}</button>
      </form>
    </div>
  )
}
