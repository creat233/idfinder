import { ScrollArea } from "@/components/ui/scroll-area";

export const PrivacyPolicyContent = () => {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-foreground/90 leading-relaxed">
            FinderID s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme de cartes d'identité numériques (MCards).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Données collectées</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">2.1 Informations fournies directement</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Pays de résidence</li>
              <li>Photo de profil (optionnel)</li>
              <li>Informations professionnelles (titre, entreprise, services)</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">2.2 Informations collectées automatiquement</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Adresse IP</li>
              <li>Type de navigateur et appareil</li>
              <li>Pages visitées et temps passé sur la plateforme</li>
              <li>Interactions avec les MCards (vues, clics)</li>
              <li>Données de géolocalisation approximative</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Utilisation des données</h2>
          <p className="text-foreground/90 leading-relaxed">
            Nous utilisons vos données personnelles pour :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Créer et gérer votre compte utilisateur</li>
            <li>Générer et personnaliser vos MCards</li>
            <li>Faciliter les connexions professionnelles</li>
            <li>Envoyer des notifications de sécurité et mises à jour importantes</li>
            <li>Améliorer nos services et votre expérience utilisateur</li>
            <li>Prévenir la fraude et assurer la sécurité de la plateforme</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Partage des données</h2>
          <p className="text-foreground/90 leading-relaxed">
            Vos informations personnelles peuvent être partagées dans les cas suivants :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li><strong>Avec votre consentement :</strong> Lorsque vous partagez votre MCard publiquement</li>
            <li><strong>Prestataires de services :</strong> Hébergement (Supabase), analyses, emails</li>
            <li><strong>Obligations légales :</strong> Si requis par la loi ou pour protéger nos droits</li>
            <li><strong>Transfert d'entreprise :</strong> En cas de fusion, acquisition ou vente d'actifs</li>
          </ul>
          <p className="text-foreground/90 leading-relaxed mt-3">
            <strong>Nous ne vendons jamais vos données personnelles à des tiers.</strong>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Sécurité des données</h2>
          <p className="text-foreground/90 leading-relaxed">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Chiffrement des données en transit (SSL/TLS)</li>
            <li>Authentification sécurisée avec Supabase Auth</li>
            <li>Contrôles d'accès stricts (Row Level Security)</li>
            <li>Sauvegardes régulières</li>
            <li>Surveillance et détection des intrusions</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Vos droits</h2>
          <p className="text-foreground/90 leading-relaxed">
            Conformément au RGPD et aux lois applicables sur la protection des données, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> Corriger les données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> Supprimer vos données ("droit à l'oubli")</li>
            <li><strong>Droit à la limitation :</strong> Restreindre le traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
            <li><strong>Droit de retrait du consentement :</strong> À tout moment</li>
          </ul>
          <p className="text-foreground/90 leading-relaxed mt-3">
            Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@finderid.info" className="text-primary hover:underline">privacy@finderid.info</a>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Cookies et technologies similaires</h2>
          <p className="text-foreground/90 leading-relaxed">
            Nous utilisons des cookies et technologies similaires pour :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Maintenir votre session active</li>
            <li>Mémoriser vos préférences</li>
            <li>Analyser l'utilisation de la plateforme</li>
            <li>Améliorer la sécurité</li>
          </ul>
          <p className="text-foreground/90 leading-relaxed mt-3">
            Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Conservation des données</h2>
          <p className="text-foreground/90 leading-relaxed">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Fournir nos services (tant que votre compte est actif)</li>
            <li>Respecter nos obligations légales (jusqu'à 5 ans après la fermeture du compte)</li>
            <li>Résoudre des litiges et faire respecter nos accords</li>
          </ul>
          <p className="text-foreground/90 leading-relaxed mt-3">
            Après cette période, vos données sont supprimées ou anonymisées de manière sécurisée.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Transferts internationaux</h2>
          <p className="text-foreground/90 leading-relaxed">
            Vos données peuvent être transférées et traitées dans des pays situés en dehors de votre pays de résidence, notamment aux États-Unis où nos serveurs Supabase sont hébergés. Nous veillons à ce que des garanties appropriées soient en place conformément aux réglementations applicables.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Protection des mineurs</h2>
          <p className="text-foreground/90 leading-relaxed">
            FinderID est destiné aux personnes âgées de 18 ans et plus. Nous ne collectons pas sciemment de données personnelles d'enfants de moins de 18 ans. Si vous pensez qu'un mineur nous a fourni des informations, veuillez nous contacter immédiatement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Modifications de la politique</h2>
          <p className="text-foreground/90 leading-relaxed">
            Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons de tout changement significatif par email ou via une notification sur la plateforme. La date de "Dernière mise à jour" en haut de ce document indique quand la politique a été révisée pour la dernière fois.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Contact</h2>
          <p className="text-foreground/90 leading-relaxed">
            Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p><strong>Email :</strong> <a href="mailto:privacy@finderid.info" className="text-primary hover:underline">privacy@finderid.info</a></p>
            <p><strong>Support :</strong> <a href="mailto:support@finderid.info" className="text-primary hover:underline">support@finderid.info</a></p>
            <p><strong>Site web :</strong> <a href="https://finderid.info" className="text-primary hover:underline">https://finderid.info</a></p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FinderID. Tous droits réservés.</p>
        </div>
      </div>
    </ScrollArea>
  );
};
