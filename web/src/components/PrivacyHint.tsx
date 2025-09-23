const texts = {
  register:
    'Vos données sont utilisées pour créer votre compte et gérer vos commandes. En savoir plus : Politique de confidentialité.',
  login:
    'Connexion sécurisée. Vos identifiants ne sont utilisés que pour accéder à votre compte.',
  checkout:
    'Nous utilisons ces informations pour traiter votre commande et la livraison.',
} as const

type PrivacyContext = keyof typeof texts

export function PrivacyHint({ context }: { context: PrivacyContext }) {
  return (
    <p className="mb-3 text-xs text-gray-600">
      {texts[context]}{' '}
      <a href="/privacy" className="underline">
        Voir la politique
      </a>
      .
    </p>
  )
}
