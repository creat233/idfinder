import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Database, Lock, Phone, Mail } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez comment nous protégeons et utilisons vos données personnelles.
          </p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Chez FinderID, nous accordons la plus haute importance à la protection de vos données personnelles. 
                Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons 
                vos informations lorsque vous utilisez notre plateforme de cartes de visite digitales et notre service 
                de récupération d'objets perdus.
              </p>
              <p>
                En utilisant nos services, vous acceptez les pratiques décrites dans cette politique.
              </p>
            </CardContent>
          </Card>

          {/* Données collectées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-green-600" />
                Données que nous collectons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">Informations d'identification :</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Photo de profil (optionnelle)</li>
                <li>Informations professionnelles (entreprise, poste, etc.)</li>
              </ul>

              <h3 className="font-semibold text-lg">Données de cartes :</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Numéros de cartes d'identité, permis de conduire, cartes bancaires (partiellement masqués)</li>
                <li>Photos des cartes trouvées</li>
                <li>Localisation où les cartes ont été trouvées</li>
              </ul>

              <h3 className="font-semibold text-lg">Données techniques :</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Pages visitées et temps passé</li>
                <li>Données de géolocalisation (avec votre consentement)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Utilisation des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-purple-600" />
                Comment nous utilisons vos données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Service de récupération :</strong> Identifier les propriétaires de cartes perdues et faciliter leur récupération
                </li>
                <li>
                  <strong>Cartes de visite digitales :</strong> Créer et gérer vos profils professionnels numériques
                </li>
                <li>
                  <strong>Notifications :</strong> Vous informer des cartes trouvées, mises à jour de profil, et communications importantes
                </li>
                <li>
                  <strong>Support client :</strong> Répondre à vos questions et résoudre les problèmes techniques
                </li>
                <li>
                  <strong>Amélioration du service :</strong> Analyser l'utilisation pour améliorer nos fonctionnalités
                </li>
                <li>
                  <strong>Sécurité :</strong> Prévenir la fraude et assurer la sécurité de la plateforme
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Partage des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-red-600" />
                Partage et protection des données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">Nous ne vendons jamais vos données.</h3>
              <p>Nous pouvons partager vos informations uniquement dans les cas suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Récupération de cartes :</strong> Coordonnées de contact pour faciliter la récupération entre le trouveur et le propriétaire
                </li>
                <li>
                  <strong>Prestataires de services :</strong> Partenaires techniques qui nous aident à fournir nos services (hébergement, paiements)
                </li>
                <li>
                  <strong>Obligations légales :</strong> Si requis par la loi ou les autorités compétentes
                </li>
                <li>
                  <strong>Protection des droits :</strong> Pour protéger nos droits, notre propriété ou la sécurité de nos utilisateurs
                </li>
              </ul>

              <h3 className="font-semibold text-lg mt-6">Mesures de sécurité :</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chiffrement des données sensibles</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Surveillance continue des accès</li>
                <li>Sauvegardes sécurisées</li>
                <li>Audits de sécurité réguliers</li>
              </ul>
            </CardContent>
          </Card>

          {/* Vos droits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                Vos droits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Conformément aux lois sur la protection des données, vous avez le droit de :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Accès :</strong> Demander une copie de vos données personnelles</li>
                <li><strong>Rectification :</strong> Corriger des informations inexactes ou incomplètes</li>
                <li><strong>Suppression :</strong> Demander la suppression de vos données (sous certaines conditions)</li>
                <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Opposition :</strong> Vous opposer au traitement de vos données</li>
                <li><strong>Limitation :</strong> Demander la limitation du traitement de vos données</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous via les moyens mentionnés ci-dessous.
              </p>
            </CardContent>
          </Card>

          {/* Conservation des données */}
          <Card>
            <CardHeader>
              <CardTitle>Conservation des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Comptes actifs :</strong> Tant que votre compte est actif</li>
                <li><strong>Cartes trouvées :</strong> 2 ans après récupération ou 5 ans si non récupérées</li>
                <li><strong>Données de facturation :</strong> 10 ans pour conformité comptable</li>
                <li><strong>Logs de sécurité :</strong> 1 an maximum</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies et technologies similaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Nous utilisons des cookies pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintenir votre session de connexion</li>
                <li>Mémoriser vos préférences</li>
                <li>Analyser l'utilisation du site</li>
                <li>Améliorer l'expérience utilisateur</li>
              </ul>
              <p>
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card>
            <CardHeader>
              <CardTitle>Modifications de cette politique</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. 
                Les modifications importantes vous seront notifiées par email ou via une notification 
                sur la plateforme. La version mise à jour sera toujours disponible sur cette page 
                avec la date de dernière modification.
              </p>
              <p className="mt-4 font-semibold">
                Dernière mise à jour : 4 septembre 2025
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-green-600" />
                Nous contacter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email : privacy@finderid.info</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Téléphone : +221 XX XXX XX XX</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Nous nous engageons à répondre à toutes les demandes dans un délai de 30 jours maximum.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};