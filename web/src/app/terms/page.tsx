export const metadata = { title: 'Conditions générales de vente' }

export default function CGVPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Conditions générales de vente</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Objet</h2>
        <p>
          Les présentes conditions régissent la vente en ligne de sneakers sur le site One Shoe.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Commande et paiement</h2>
        <ul className="list-disc pl-6">
          <li>Le client sélectionne les produits et valide sa commande.</li>
          <li>Paiement sécurisé via Stripe.</li>
          <li>Confirmation de commande envoyée par email.</li>
          <li>Droit de rétractation&nbsp;: 14 jours à compter de la réception du produit.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Livraison</h2>
        <p>
          Livraison en France métropolitaine sous 3 à 5 jours ouvrés. Les frais et délais sont précisés lors de la commande.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Retour et remboursement</h2>
        <p>
          Les retours sont acceptés dans le délai légal de rétractation. Remboursement sous 14 jours après réception du produit retourné.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
        <p>
          Les données collectées lors de la commande sont traitées conformément au RGPD. Pour plus d’informations, consultez notre <a className="underline" href="/privacy">Politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Litiges</h2>
        <p>
          En cas de litige, une solution amiable sera recherchée. À défaut, le tribunal compétent sera celui du siège social de One Shoe.
        </p>
      </section>
    </main>
  )
}
