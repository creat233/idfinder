import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Heart, Phone, CheckCircle } from "lucide-react";

export const FreeServiceExplanation = () => {
  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="bg-white/20 p-2 rounded-full">
            <GraduationCap className="h-6 w-6" />
          </div>
          🎓 Service GRATUIT - Cartes Étudiantes et de Santé
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Cartes Étudiantes</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Carte d'étudiant universitaire</li>
              <li>• Carte de bibliothèque</li>
              <li>• Carte de transport étudiant</li>
              <li>• Carte de restaurant universitaire</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Cartes de Santé</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Carte vitale</li>
              <li>• Carte d'assurance maladie</li>
              <li>• Carte de mutuelle</li>
              <li>• Carte hôpital/clinique</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Avantages du service gratuit
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
            <div>
              <p>✅ <strong>100% Gratuit</strong> - Aucun frais</p>
              <p>✅ <strong>Contact direct</strong> - Numéro du trouveur</p>
              <p>✅ <strong>Récupération rapide</strong> - Accord direct</p>
            </div>
            <div>
              <p>✅ <strong>Validation sécurisée</strong> - Vérification d'identité</p>
              <p>✅ <strong>Support social</strong> - Aide aux étudiants</p>
              <p>✅ <strong>Livraison possible</strong> - Selon accord</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Comment ça marche ?
          </h4>
          <ol className="text-sm text-blue-700 space-y-2">
            <li><strong>1.</strong> Cliquez sur "Récupérer ma carte"</li>
            <li><strong>2.</strong> Validez votre identité avec une pièce d'identité</li>
            <li><strong>3.</strong> Obtenez immédiatement le numéro du trouveur</li>
            <li><strong>4.</strong> Contactez directement pour organiser la récupération</li>
            <li><strong>5.</strong> Récupérez votre carte gratuitement !</li>
          </ol>
        </div>

        <div className="text-center p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-medium">
            🌟 FinderID soutient les étudiants et facilite l'accès aux soins de santé
          </p>
          <p className="text-sm text-green-700 mt-1">
            Notre mission : rendre le service accessible à tous, particulièrement aux étudiants
          </p>
        </div>
      </CardContent>
    </Card>
  );
};