export const metadata = { title: 'Mentions légales' }

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@oneshoe.example'

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p>
          One Shoe<br />
          SIRET&nbsp;: 123 456 789 00012<br />
          Adresse&nbsp;: 12 rue des Sneakers, 75000 Paris, France<br />
          Email&nbsp;: <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a><br />
          Responsable de la publication&nbsp;: Marine Fruitier
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
        <p>
          Supabase<br />
          Adresse&nbsp;: 60, 29th Street #343, San Francisco, CA 94110, USA<br />
          Site web&nbsp;: <a href="https://supabase.com" className="underline">supabase.com</a>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p>
          Tous les contenus présents sur le site (textes, images, logos, etc.) sont protégés par le droit d’auteur. Toute reproduction est interdite sans autorisation préalable.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
        <p>
          Pour en savoir plus sur la gestion de vos données, consultez notre <a href="/privacy" className="underline">politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          Pour toute question, contactez-nous à <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </main>
  )
}
