import { ScrollArea } from "@/components/ui/scroll-area";

export const TermsOfServiceContent = () => {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptation des conditions</h2>
          <p className="text-foreground/90 leading-relaxed">
            En accédant et en utilisant la plateforme FinderID, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Ces CGU constituent un contrat juridiquement contraignant entre vous ("Utilisateur", "vous") et FinderID ("nous", "notre", "la Plateforme").
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Description du service</h2>
          <p className="text-foreground/90 leading-relaxed">
            FinderID est une plateforme numérique qui permet aux utilisateurs de :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Créer et gérer des cartes d'identité numériques professionnelles (MCards)</li>
            <li>Partager leurs informations de contact et services professionnels</li>
            <li>Signaler et retrouver des documents perdus (cartes d'identité, permis, etc.)</li>
            <li>Se connecter avec d'autres professionnels</li>
            <li>Bénéficier de fonctionnalités premium selon l'abonnement choisi</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Inscription et compte utilisateur</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">3.1 Conditions d'inscription</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Vous devez fournir des informations exactes et à jour</li>
              <li>Vous ne pouvez créer qu'un seul compte personnel</li>
              <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">3.2 Responsabilité du compte</h3>
            <p className="text-foreground/90 leading-relaxed">
              Vous êtes entièrement responsable de toutes les activités effectuées depuis votre compte. En cas d'utilisation non autorisée, vous devez nous en informer immédiatement à <a href="mailto:security@finderid.info" className="text-primary hover:underline">security@finderid.info</a>.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Utilisation acceptable</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">4.1 Vous vous engagez à NE PAS :</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Publier du contenu illégal, offensant, diffamatoire ou discriminatoire</li>
              <li>Usurper l'identité d'une autre personne ou entité</li>
              <li>Partager de fausses informations ou documents frauduleux</li>
              <li>Violer les droits de propriété intellectuelle d'autrui</li>
              <li>Utiliser des robots, scripts ou outils automatisés sans autorisation</li>
              <li>Tenter d'accéder de manière non autorisée aux systèmes de la plateforme</li>
              <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
              <li>Utiliser la plateforme à des fins de spam ou de sollicitation non sollicitée</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">4.2 Sanctions</h3>
            <p className="text-foreground/90 leading-relaxed">
              En cas de violation de ces règles, nous nous réservons le droit de suspendre ou supprimer votre compte sans préavis ni remboursement.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. MCards et contenu utilisateur</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">5.1 Propriété du contenu</h3>
            <p className="text-foreground/90 leading-relaxed">
              Vous conservez tous les droits sur le contenu que vous publiez (photos, textes, informations professionnelles). En publiant du contenu sur FinderID, vous nous accordez une licence mondiale, non exclusive, libre de redevances pour utiliser, reproduire, modifier et afficher ce contenu dans le cadre de la fourniture de nos services.
            </p>

            <h3 className="text-xl font-medium mt-4">5.2 Visibilité des MCards</h3>
            <p className="text-foreground/90 leading-relaxed">
              Les MCards peuvent être configurées comme publiques ou privées. Les MCards publiques sont accessibles à tous les utilisateurs d'Internet et peuvent être indexées par les moteurs de recherche. Vous contrôlez la visibilité de vos MCards via les paramètres de votre profil.
            </p>

            <h3 className="text-xl font-medium mt-4">5.3 Modération du contenu</h3>
            <p className="text-foreground/90 leading-relaxed">
              Nous nous réservons le droit de supprimer tout contenu qui viole ces CGU, notre Code de Conduite ou la législation applicable, sans notification préalable.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Abonnements et paiements</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">6.1 Offres</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li><strong>Gratuit :</strong> Jusqu'à 2 MCards avec fonctionnalités de base</li>
              <li><strong>Premium :</strong> 5 MCards avec fonctionnalités avancées</li>
              <li><strong>Pro :</strong> 10 MCards avec toutes les fonctionnalités</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">6.2 Facturation</h3>
            <p className="text-foreground/90 leading-relaxed">
              Les abonnements sont facturés mensuellement ou annuellement selon votre choix. Les paiements sont traités de manière sécurisée via nos prestataires de paiement certifiés. Toutes les transactions sont en FCFA ou dans la devise locale applicable.
            </p>

            <h3 className="text-xl font-medium mt-4">6.3 Renouvellement automatique</h3>
            <p className="text-foreground/90 leading-relaxed">
              Les abonnements se renouvellent automatiquement sauf annulation avant la date de renouvellement. Vous pouvez annuler à tout moment depuis votre profil.
            </p>

            <h3 className="text-xl font-medium mt-4">6.4 Remboursements</h3>
            <p className="text-foreground/90 leading-relaxed">
              Les paiements ne sont généralement pas remboursables, sauf en cas d'erreur de facturation ou selon la loi applicable. Les demandes de remboursement doivent être envoyées à <a href="mailto:billing@finderid.info" className="text-primary hover:underline">billing@finderid.info</a> dans les 7 jours suivant le paiement.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Signalement de documents perdus</h2>
          <p className="text-foreground/90 leading-relaxed">
            La fonctionnalité de signalement de documents perdus est fournie en tant que service communautaire. FinderID :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Ne garantit pas la récupération des documents perdus</li>
            <li>N'est pas responsable de l'exactitude des signalements</li>
            <li>Se réserve le droit de facturer des frais de récupération selon les tarifs affichés</li>
            <li>Encourage la vérification de l'identité lors de la restitution</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Propriété intellectuelle</h2>
          <p className="text-foreground/90 leading-relaxed">
            La plateforme FinderID, incluant son design, son logo, ses fonctionnalités et son code source, est protégée par les lois sur la propriété intellectuelle. Tous les droits sont réservés. Vous ne pouvez pas :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Copier, modifier ou distribuer notre code ou design</li>
            <li>Utiliser notre marque ou logo sans autorisation écrite</li>
            <li>Créer des œuvres dérivées basées sur notre plateforme</li>
            <li>Effectuer de l'ingénierie inverse de nos systèmes</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Limitation de responsabilité</h2>
          <p className="text-foreground/90 leading-relaxed">
            Dans toute la mesure permise par la loi :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>FinderID est fourni "tel quel" sans garantie d'aucune sorte</li>
            <li>Nous ne garantissons pas un service ininterrompu ou sans erreur</li>
            <li>Nous ne sommes pas responsables des pertes de données ou de revenus</li>
            <li>Notre responsabilité totale ne dépassera pas le montant payé au cours des 12 derniers mois</li>
            <li>Nous ne sommes pas responsables des interactions entre utilisateurs</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Indemnisation</h2>
          <p className="text-foreground/90 leading-relaxed">
            Vous acceptez d'indemniser et de dégager FinderID de toute responsabilité concernant les réclamations, dommages, pertes et dépenses (y compris les frais juridiques) découlant de :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Votre utilisation de la plateforme</li>
            <li>Votre violation de ces CGU</li>
            <li>Votre violation des droits d'un tiers</li>
            <li>Le contenu que vous publiez</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Résiliation</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">11.1 Par vous</h3>
            <p className="text-foreground/90 leading-relaxed">
              Vous pouvez fermer votre compte à tout moment via les paramètres de votre profil. La fermeture entraîne la suppression de vos MCards et données personnelles conformément à notre Politique de Confidentialité.
            </p>

            <h3 className="text-xl font-medium mt-4">11.2 Par nous</h3>
            <p className="text-foreground/90 leading-relaxed">
              Nous pouvons suspendre ou résilier votre compte immédiatement en cas de :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Violation des CGU ou du Code de Conduite</li>
              <li>Activité frauduleuse ou illégale</li>
              <li>Non-paiement des frais d'abonnement</li>
              <li>Inactivité prolongée (plus de 2 ans)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Modifications des CGU</h2>
          <p className="text-foreground/90 leading-relaxed">
            Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications substantielles vous seront notifiées par email ou via une notification sur la plateforme 30 jours avant leur entrée en vigueur. Votre utilisation continue de FinderID après l'entrée en vigueur des modifications constitue votre acceptation des nouvelles CGU.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Droit applicable et juridiction</h2>
          <p className="text-foreground/90 leading-relaxed">
            Ces CGU sont régies par les lois en vigueur dans votre pays de résidence. Tout litige sera soumis à la juridiction exclusive des tribunaux compétents de votre pays.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">14. Dispositions générales</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li><strong>Intégralité de l'accord :</strong> Ces CGU constituent l'intégralité de l'accord entre vous et FinderID</li>
            <li><strong>Divisibilité :</strong> Si une clause est jugée invalide, les autres restent en vigueur</li>
            <li><strong>Non-renonciation :</strong> Notre non-exercice d'un droit ne constitue pas une renonciation à ce droit</li>
            <li><strong>Cession :</strong> Vous ne pouvez pas céder vos droits sans notre consentement</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">15. Contact</h2>
          <p className="text-foreground/90 leading-relaxed">
            Pour toute question concernant ces CGU :
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p><strong>Email :</strong> <a href="mailto:legal@finderid.info" className="text-primary hover:underline">legal@finderid.info</a></p>
            <p><strong>Support :</strong> <a href="mailto:support@finderid.info" className="text-primary hover:underline">support@finderid.info</a></p>
            <p><strong>Site web :</strong> <a href="https://finderid.info" className="text-primary hover:underline">https://finderid.info</a></p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground italic">
            En utilisant FinderID, vous reconnaissez avoir lu, compris et accepté ces Conditions Générales d'Utilisation ainsi que notre Politique de Confidentialité et notre Code de Conduite.
          </p>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FinderID. Tous droits réservés.</p>
        </div>
      </div>
    </ScrollArea>
  );
};
