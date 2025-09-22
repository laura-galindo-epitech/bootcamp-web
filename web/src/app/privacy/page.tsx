export const metadata = { title: 'Politique de confidentialité' }

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Politique de confidentialité</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Qui sommes-nous ?</h2>
        <p>
          One Shoe – boutique de sneakers en ligne.<br />
          Responsable du traitement : Marine Fruitier.<br />
          Contact DPO : <a href="mailto:dpo@onesshoe.com" className="underline">dpo@onesshoe.com</a>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Finalités et bases légales</h2>
        <ul className="list-disc pl-6">
          <li>Gestion du compte et des commandes (exécution du contrat)</li>
          <li>Service client et support (intérêt légitime)</li>
          <li>Facturation et obligations légales (obligation légale)</li>
          <li>Envoi de newsletter (consentement)</li>
          <li>Mesure d’audience (consentement, si activée)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Durées de conservation</h2>
        <ul className="list-disc pl-6">
          <li>Comptes inactifs : 3 ans</li>
          <li>Factures : 10 ans</li>
          <li>Tickets support : 3 ans</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Destinataires et transferts</h2>
        <p>
          Vos données sont transmises uniquement à nos prestataires (paiement, hébergement, support) pour les besoins du service.<br />
          Aucun transfert hors UE sans garanties adéquates.<br />
          Aucune revente de vos données.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
        <ul className="list-disc pl-6">
          <li>Accès et portabilité : <a className="underline" href="/account/export">exporter mes données</a></li>
          <li>Rectification : <a className="underline" href="/account">modifier mon profil</a></li>
          <li>Effacement : <a className="underline" href="/account/delete">supprimer mon compte</a></li>
          <li>Opposition et limitation : via les préférences du compte</li>
        </ul>
        <p>
          Pour exercer vos droits, contactez-nous à <a href="mailto:dpo@onesshoe.com" className="underline">dpo@onesshoe.com</a>.<br />
          Réponse sous 1 mois conformément au RGPD.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          Pour toute question sur la protection des données, contactez notre DPO à <a href="mailto:dpo@onesshoe.com" className="underline">dpo@onesshoe.com</a>.
        </p>
      </section>
    </main>
  )
}
