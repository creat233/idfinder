import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, AlertTriangle, Users, Shield, BookOpen, Phone, Mail } from "lucide-react";

export const AdminLegalManagement = () => {
  const legalAreas = [
    {
      title: "Protection des données (RGPD)",
      priority: "high",
      description: "Conformité avec le Règlement Général sur la Protection des Données",
      actions: [
        "Audit de conformité RGPD",
        "Mise à jour de la politique de confidentialité",
        "Formation équipe sur protection des données",
        "Procédures de suppression des données"
      ],
      status: "attention"
    },
    {
      title: "Conditions générales d'utilisation",
      priority: "high",
      description: "Révision et mise à jour des CGU",
      actions: [
        "Révision des clauses de responsabilité",
        "Mise à jour des conditions de paiement",
        "Clauses de résiliation",
        "Validation juridique"
      ],
      status: "ok"
    },
    {
      title: "Droit commercial",
      priority: "medium",
      description: "Aspects commerciaux et contractuels",
      actions: [
        "Contrats fournisseurs",
        "Conditions de vente",
        "Litiges commerciaux",
        "Négociations partenariats"
      ],
      status: "ok"
    },
    {
      title: "Propriété intellectuelle",
      priority: "medium",
      description: "Protection de la marque et des contenus",
      actions: [
        "Dépôt de marque",
        "Protection du nom de domaine",
        "Droits d'auteur sur le contenu",
        "Licences logicielles"
      ],
      status: "attention"
    },
    {
      title: "Responsabilité civile",
      priority: "high",
      description: "Couverture des risques et assurances",
      actions: [
        "Assurance responsabilité civile professionnelle",
        "Assurance cyber-risques",
        "Clauses de limitation de responsabilité",
        "Gestion des réclamations"
      ],
      status: "urgent"
    },
    {
      title: "Droit du travail",
      priority: "low",
      description: "Gestion RH et relations de travail",
      actions: [
        "Contrats de travail",
        "Règlement intérieur",
        "Formation sécurité",
        "Gestion des conflits"
      ],
      status: "ok"
    }
  ];

  const urgentTasks = [
    {
      title: "Mise à jour Police d'assurance",
      deadline: "2025-02-15",
      priority: "urgent",
      description: "Renouvellement de l'assurance responsabilité civile"
    },
    {
      title: "Audit RGPD",
      deadline: "2025-03-01",
      priority: "high",
      description: "Audit complet de conformité RGPD"
    },
    {
      title: "Révision CGU",
      deadline: "2025-02-28",
      priority: "medium",
      description: "Mise à jour des conditions générales"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-500';
      case 'attention': return 'bg-orange-500';
      case 'ok': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec informations avocat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            Gestion Juridique & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Cabinet Juridique Recommandé
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Cabinet:</strong> Avocat & Associés Sénégal</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+221 33 XXX XX XX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@avocat-senegal.sn</span>
                </div>
                <p><strong>Spécialités:</strong> Droit des affaires, RGPD, Digital</p>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Tâches Urgentes
              </h3>
              <div className="space-y-2">
                {urgentTasks.slice(0, 3).map((task, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{task.title}</span>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.deadline}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domaines juridiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Domaines Juridiques à Surveiller
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {legalAreas.map((area, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{area.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)}`}></div>
                    <Badge className={getPriorityColor(area.priority)}>
                      {area.priority}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-3">{area.description}</p>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium">Actions requises:</p>
                  {area.actions.slice(0, 2).map((action, actionIndex) => (
                    <p key={actionIndex} className="text-xs text-gray-600">• {action}</p>
                  ))}
                  {area.actions.length > 2 && (
                    <p className="text-xs text-blue-600">+{area.actions.length - 2} autres...</p>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Voir détails
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tâches urgentes détaillées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Tâches Juridiques Urgentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentTasks.map((task, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    Échéance: {task.deadline}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Contacter avocat
                  </Button>
                  <Button variant="outline" size="sm">
                    Marquer terminé
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Propositions d'amélioration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            Propositions d'Amélioration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Sécurité & Compliance</h3>
              <ul className="space-y-2 text-sm">
                <li>• Mettre en place un audit de sécurité trimestriel</li>
                <li>• Créer une charte de protection des données</li>
                <li>• Former l'équipe sur les bonnes pratiques RGPD</li>
                <li>• Implémenter un système de backup juridique</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Gestion des Risques</h3>
              <ul className="space-y-2 text-sm">
                <li>• Souscrire une assurance cyber-risques</li>
                <li>• Créer un plan de gestion de crise</li>
                <li>• Établir des procédures de signalement</li>
                <li>• Mettre en place une veille juridique automatisée</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};