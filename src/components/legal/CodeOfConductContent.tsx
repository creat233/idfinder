import { ScrollArea } from "@/components/ui/scroll-area";

export const CodeOfConductContent = () => {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Code de Conduite</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Notre engagement</h2>
          <p className="text-foreground/90 leading-relaxed">
            FinderID s'engage à fournir une communauté accueillante, sûre et inclusive pour tous ses membres, indépendamment de l'âge, de l'apparence physique, du handicap, de l'ethnicité, de l'identité et de l'expression de genre, du niveau d'expérience, de la nationalité, de la religion ou de l'orientation sexuelle.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Ce Code de Conduite définit nos attentes envers tous ceux qui participent à notre communauté, ainsi que les conséquences d'un comportement inacceptable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Comportements attendus</h2>
          <p className="text-foreground/90 leading-relaxed">
            Tous les membres de la communauté FinderID sont attendus de :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li><strong>Être respectueux :</strong> Traiter tous les utilisateurs avec dignité et respect</li>
            <li><strong>Être authentique :</strong> Fournir des informations véridiques et ne pas usurper l'identité d'autrui</li>
            <li><strong>Être professionnel :</strong> Maintenir un niveau de professionnalisme dans toutes les interactions</li>
            <li><strong>Être constructif :</strong> Offrir des critiques constructives et accepter les retours avec grâce</li>
            <li><strong>Être inclusif :</strong> Accueillir et soutenir les nouveaux membres de la communauté</li>
            <li><strong>Être responsable :</strong> Assumer la responsabilité de vos actions et paroles</li>
            <li><strong>Protéger la vie privée :</strong> Respecter la confidentialité des informations d'autrui</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Comportements inacceptables</h2>
          <p className="text-foreground/90 leading-relaxed">
            Les comportements suivants sont considérés comme inacceptables sur FinderID :
          </p>

          <div className="space-y-3 ml-4">
            <div>
              <h3 className="text-lg font-medium">2.1 Harcèlement</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-foreground/90">
                <li>Messages menaçants ou intimidants</li>
                <li>Commentaires offensants liés à l'identité personnelle</li>
                <li>Attention sexuelle non sollicitée</li>
                <li>Harcèlement délibéré ou traque en ligne</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">2.2 Discrimination</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-foreground/90">
                <li>Discrimination basée sur la race, l'ethnie, la religion, le genre, l'orientation sexuelle ou le handicap</li>
                <li>Propos haineux ou symboles discriminatoires</li>
                <li>Exclusion intentionnelle de groupes de personnes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">2.3 Fraude et tromperie</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-foreground/90">
                <li>Usurpation d'identité ou faux profils</li>
                <li>Fausses déclarations de services ou qualifications</li>
                <li>Escroqueries ou tentatives de fraude financière</li>
                <li>Manipulation de documents ou informations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">2.4 Contenu inapproprié</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-foreground/90">
                <li>Contenu pornographique ou sexuellement explicite</li>
                <li>Violence graphique ou contenu perturbant</li>
                <li>Incitation à la haine ou à la violence</li>
                <li>Promotion d'activités illégales</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">2.5 Spam et abus</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-foreground/90">
                <li>Messages non sollicités en masse (spam)</li>
                <li>Publicité excessive ou trompeuse</li>
                <li>Utilisation abusive des fonctionnalités de la plateforme</li>
                <li>Création de comptes multiples pour contourner les restrictions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">2.6 Violation de la propriété intellectuelle</h3>
              <ul className="list-disc list-inside space-y-1 ml-4 text-foreground/90">
                <li>Utilisation non autorisée de marques ou logos</li>
                <li>Publication de contenu protégé par des droits d'auteur</li>
                <li>Plagiat ou appropriation du travail d'autrui</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Utilisation des MCards</h2>
          <p className="text-foreground/90 leading-relaxed">
            Les MCards doivent être utilisées de manière responsable et professionnelle :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Fournir des informations de contact exactes et à jour</li>
            <li>Utiliser des photos professionnelles et appropriées</li>
            <li>Décrire vos services et compétences de manière honnête</li>
            <li>Ne pas copier ou imiter les MCards d'autres utilisateurs</li>
            <li>Respecter les droits d'auteur pour les images et le contenu utilisés</li>
            <li>Ne pas utiliser les MCards pour des activités illégales ou contraires à l'éthique</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Signalement de documents perdus</h2>
          <p className="text-foreground/90 leading-relaxed">
            Lorsque vous utilisez la fonctionnalité de signalement de documents perdus :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Fournir des informations exactes et complètes sur le document trouvé</li>
            <li>Ne pas utiliser cette fonctionnalité pour faire de fausses déclarations</li>
            <li>Respecter la vie privée de la personne dont le document a été trouvé</li>
            <li>Agir de bonne foi pour faciliter la restitution du document</li>
            <li>Ne pas exiger de compensation déraisonnable pour la restitution</li>
            <li>Signaler immédiatement toute tentative de fraude ou d'abus</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Interactions professionnelles</h2>
          <p className="text-foreground/90 leading-relaxed">
            FinderID est une plateforme professionnelle. Les interactions doivent être :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li><strong>Respectueuses :</strong> Même en cas de désaccord</li>
            <li><strong>Pertinentes :</strong> Liées aux activités professionnelles</li>
            <li><strong>Transparentes :</strong> Divulguer les conflits d'intérêts</li>
            <li><strong>Honnêtes :</strong> Ne pas faire de promesses que vous ne pouvez pas tenir</li>
            <li><strong>Courtoise :</strong> Répondre aux messages dans des délais raisonnables</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Protection des données et vie privée</h2>
          <p className="text-foreground/90 leading-relaxed">
            Vous devez respecter la vie privée des autres utilisateurs :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Ne pas collecter ou stocker les données personnelles d'autres utilisateurs sans consentement</li>
            <li>Ne pas partager les informations de contact d'autrui sans permission</li>
            <li>Utiliser les données partagées uniquement pour les fins convenues</li>
            <li>Signaler toute violation de données dont vous avez connaissance</li>
            <li>Respecter les préférences de confidentialité des autres utilisateurs</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Signalement des violations</h2>
          <div className="space-y-3">
            <p className="text-foreground/90 leading-relaxed">
              Si vous êtes témoin ou victime d'un comportement qui viole ce Code de Conduite :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
              <li>Utilisez la fonction de signalement intégrée à la plateforme</li>
              <li>Contactez notre équipe de modération à <a href="mailto:conduct@finderid.info" className="text-primary hover:underline">conduct@finderid.info</a></li>
              <li>Fournissez autant de détails que possible (captures d'écran, URLs, dates)</li>
              <li>Tous les signalements sont traités de manière confidentielle</li>
            </ul>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
              <p className="text-amber-900 dark:text-amber-100 font-medium">Important :</p>
              <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
                Les faux signalements ou les signalements malveillants sont eux-mêmes considérés comme des violations de ce Code de Conduite et peuvent entraîner des sanctions.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Conséquences des violations</h2>
          <p className="text-foreground/90 leading-relaxed">
            Les violations de ce Code de Conduite peuvent entraîner les actions suivantes, selon la gravité :
          </p>

          <div className="space-y-3 ml-4">
            <div>
              <h3 className="text-lg font-medium">8.1 Avertissement</h3>
              <p className="text-foreground/90">
                Pour les premières infractions mineures, un avertissement écrit sera envoyé expliquant la violation et les attentes pour l'avenir.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">8.2 Restriction temporaire</h3>
              <p className="text-foreground/90">
                Suspension temporaire de certaines fonctionnalités (messagerie, publication, etc.) pour une durée déterminée (7 à 30 jours).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">8.3 Suspension du compte</h3>
              <p className="text-foreground/90">
                Suspension complète du compte pour une durée déterminée (30 à 90 jours) pour les violations répétées ou graves.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">8.4 Suppression permanente</h3>
              <p className="text-foreground/90">
                Suppression définitive du compte et interdiction de créer de nouveaux comptes pour :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-foreground/90 text-sm mt-2">
                <li>Violations graves ou répétées</li>
                <li>Activités illégales</li>
                <li>Harcèlement persistant</li>
                <li>Fraude ou usurpation d'identité</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">8.5 Actions légales</h3>
              <p className="text-foreground/90">
                Dans les cas les plus graves (menaces, fraude, activités illégales), nous nous réservons le droit de signaler le comportement aux autorités compétentes et de poursuivre des actions légales.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Processus d'appel</h2>
          <p className="text-foreground/90 leading-relaxed">
            Si vous pensez qu'une action disciplinaire a été prise à tort :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Vous pouvez faire appel dans les 14 jours suivant la notification</li>
            <li>Envoyez votre appel à <a href="mailto:appeals@finderid.info" className="text-primary hover:underline">appeals@finderid.info</a></li>
            <li>Incluez votre ID d'utilisateur, les détails de la sanction et vos arguments</li>
            <li>Une équipe différente examinera votre cas</li>
            <li>Vous recevrez une réponse dans les 7 jours ouvrables</li>
            <li>La décision finale de l'équipe d'appel est définitive</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Responsabilité de la communauté</h2>
          <p className="text-foreground/90 leading-relaxed">
            Construire une communauté saine est une responsabilité partagée. Nous encourageons tous les membres à :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Intervenir de manière respectueuse si vous voyez un comportement problématique</li>
            <li>Soutenir les nouveaux membres et les aider à comprendre nos normes</li>
            <li>Signaler les violations plutôt que de les ignorer</li>
            <li>Donner l'exemple par votre propre comportement</li>
            <li>Contribuer positivement à l'atmosphère de la communauté</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Évolution du Code de Conduite</h2>
          <p className="text-foreground/90 leading-relaxed">
            Ce Code de Conduite est un document vivant qui évoluera avec notre communauté. Nous :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/90">
            <li>Réviserons ce code périodiquement</li>
            <li>Solliciterons les retours de la communauté</li>
            <li>Mettrons à jour les règles en fonction de nouveaux défis</li>
            <li>Communiquerons clairement tous les changements significatifs</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Contact</h2>
          <p className="text-foreground/90 leading-relaxed">
            Pour toute question concernant ce Code de Conduite :
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p><strong>Email général :</strong> <a href="mailto:conduct@finderid.info" className="text-primary hover:underline">conduct@finderid.info</a></p>
            <p><strong>Signalements :</strong> <a href="mailto:report@finderid.info" className="text-primary hover:underline">report@finderid.info</a></p>
            <p><strong>Appels :</strong> <a href="mailto:appeals@finderid.info" className="text-primary hover:underline">appeals@finderid.info</a></p>
            <p><strong>Support :</strong> <a href="mailto:support@finderid.info" className="text-primary hover:underline">support@finderid.info</a></p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-foreground/90 font-medium text-center">
              Merci de contribuer à faire de FinderID une communauté accueillante, respectueuse et professionnelle pour tous.
            </p>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FinderID. Tous droits réservés.</p>
        </div>
      </div>
    </ScrollArea>
  );
};
