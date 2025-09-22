import ContactForm from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact | OneShoe',
  description: 'Formulaire de contact OneShoe (support, RGPD, partenariat).'
}

const CONTACT_EMAIL = 'contact@onesshoe.com'

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Besoin d’aide sur une commande, une question RGPD ou un partenariat ? Remplissez le formulaire ci-dessous :
          une fois validé, votre application mail ouvrira un message adressé à {CONTACT_EMAIL} avec les informations
          fournies.
        </p>
      </header>

      <ContactForm />
    </section>
  )
}
