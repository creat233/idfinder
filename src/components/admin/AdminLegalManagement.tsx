import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Scale, FileText, AlertTriangle, Phone, Mail, BookOpen, CheckCircle2, X, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type ActionDetail = {
  title: string;
  description: string;
  steps: string[];
  importance: string;
  ressources?: string[];
};

export const AdminLegalManagement = () => {
  const { toast } = useToast();
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<ActionDetail | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
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

  const handleContactLawyer = () => {
    toast({
      title: "Contact avocat",
      description: "Ouverture du client email...",
    });
    window.location.href = "mailto:contact@avocat-senegal.sn?subject=Consultation juridique FinderID";
  };

  const handleMarkComplete = (taskTitle: string) => {
    setCompletedTasks([...completedTasks, taskTitle]);
    toast({
      title: "Tâche complétée",
      description: `"${taskTitle}" a été marquée comme terminée.`,
    });
  };

  const getActionDetails = (actionTitle: string): ActionDetail => {
    const actionDetailsMap: Record<string, ActionDetail> = {
      "Audit de conformité RGPD": {
        title: "Audit de conformité RGPD",
        description: "Évaluation complète de la conformité de l'application avec le Règlement Général sur la Protection des Données",
        importance: "CRITIQUE - La non-conformité peut entraîner des sanctions jusqu'à 4% du CA annuel mondial",
        steps: [
          "Cartographier tous les traitements de données personnelles",
          "Vérifier les bases légales de chaque traitement",
          "Auditer les mesures de sécurité en place",
          "Vérifier la conformité des mentions d'information",
          "Contrôler les procédures d'exercice des droits",
          "Analyser les transferts de données hors UE",
          "Documenter toutes les non-conformités",
          "Établir un plan d'action correctif"
        ],
        ressources: ["CNIL - Guide de l'audit RGPD", "Modèle de registre des traitements"]
      },
      "Mise à jour de la politique de confidentialité": {
        title: "Mise à jour de la politique de confidentialité",
        description: "Révision et actualisation de la politique de confidentialité pour refléter les pratiques actuelles",
        importance: "HAUTE - Document légalement obligatoire devant être clair et accessible",
        steps: [
          "Lister toutes les données collectées (type, finalité, durée)",
          "Identifier les bases légales pour chaque traitement",
          "Décrire les mesures de sécurité mises en place",
          "Expliquer les droits des utilisateurs (accès, rectification, suppression...)",
          "Mentionner les destinataires des données",
          "Détailler les transferts internationaux éventuels",
          "Rédiger dans un langage clair et accessible",
          "Faire valider par un juriste spécialisé RGPD"
        ],
        ressources: ["Template politique de confidentialité CNIL", "Générateur RGPD"]
      },
      "Formation équipe sur protection des données": {
        title: "Formation équipe sur protection des données",
        description: "Sensibilisation et formation de l'équipe aux bonnes pratiques RGPD",
        importance: "MOYENNE - Essentiel pour maintenir la conformité au quotidien",
        steps: [
          "Identifier les besoins de formation par profil",
          "Préparer les modules de formation (développeurs, support, marketing)",
          "Couvrir les principes fondamentaux du RGPD",
          "Former sur les procédures internes (gestion des demandes, incidents)",
          "Créer des guides de référence rapide",
          "Organiser des sessions de mise à jour régulières",
          "Tester les connaissances acquises",
          "Documenter les formations réalisées"
        ]
      },
      "Procédures de suppression des données": {
        title: "Procédures de suppression des données",
        description: "Mise en place de processus pour gérer les demandes de suppression et la rétention des données",
        importance: "HAUTE - Droit fondamental des utilisateurs",
        steps: [
          "Définir les durées de conservation par type de données",
          "Créer un processus de suppression sécurisée",
          "Mettre en place un système de réponse aux demandes (délai: 1 mois)",
          "Automatiser les suppressions périodiques",
          "Documenter les raisons de conservation prolongée",
          "Former l'équipe aux procédures",
          "Tenir un registre des demandes traitées"
        ]
      },
      "Révision des clauses de responsabilité": {
        title: "Révision des clauses de responsabilité",
        description: "Analyse et mise à jour des clauses limitant la responsabilité de l'entreprise",
        importance: "HAUTE - Protection juridique de l'entreprise",
        steps: [
          "Analyser les risques spécifiques de l'activité",
          "Vérifier la conformité avec le droit sénégalais",
          "Définir les exclusions et limitations de responsabilité",
          "S'assurer de la clarté et visibilité des clauses",
          "Vérifier la compatibilité avec les assurances",
          "Faire valider par un avocat spécialisé",
          "Mettre à jour dans tous les documents contractuels"
        ]
      },
      "Mise à jour des conditions de paiement": {
        title: "Mise à jour des conditions de paiement",
        description: "Révision des modalités de paiement, remboursement et facturation",
        importance: "MOYENNE - Clarté commerciale et protection contre les litiges",
        steps: [
          "Définir les moyens de paiement acceptés",
          "Préciser les délais de paiement",
          "Établir la politique de remboursement",
          "Décrire les conséquences des retards de paiement",
          "Mentionner les frais applicables",
          "Indiquer la devise et les conversions",
          "Conformité avec la réglementation bancaire locale"
        ]
      },
      "Clauses de résiliation": {
        title: "Clauses de résiliation",
        description: "Conditions et modalités de résiliation des services",
        importance: "MOYENNE - Protection mutuelle des parties",
        steps: [
          "Définir les conditions de résiliation par l'utilisateur",
          "Établir les motifs de résiliation par l'entreprise",
          "Préciser les délais de préavis",
          "Décrire les effets de la résiliation (données, remboursement)",
          "Mentionner les obligations post-résiliation",
          "Vérifier la conformité légale au Sénégal"
        ]
      },
      "Validation juridique": {
        title: "Validation juridique",
        description: "Revue complète des documents légaux par un avocat",
        importance: "CRITIQUE - Sécurisation juridique de l'ensemble",
        steps: [
          "Compiler tous les documents légaux",
          "Sélectionner un cabinet spécialisé en droit digital",
          "Soumettre pour revue approfondie",
          "Intégrer les recommandations",
          "Obtenir la validation finale",
          "Planifier des revues périodiques (annuelles)"
        ]
      },
      "Contrats fournisseurs": {
        title: "Contrats fournisseurs",
        description: "Gestion et révision des contrats avec les fournisseurs de services",
        importance: "HAUTE - Protection des intérêts commerciaux",
        steps: [
          "Inventorier tous les fournisseurs critiques",
          "Vérifier les SLA et garanties",
          "Analyser les clauses de résiliation",
          "Vérifier la conformité RGPD (sous-traitants)",
          "Négocier les conditions commerciales",
          "Établir des contrats-types",
          "Mettre en place un suivi des échéances"
        ]
      },
      "Conditions de vente": {
        title: "Conditions de vente",
        description: "Conditions générales de vente pour les services proposés",
        importance: "HAUTE - Cadre juridique des transactions",
        steps: [
          "Décrire précisément les services vendus",
          "Fixer les tarifs et conditions tarifaires",
          "Définir les modalités de commande et de livraison",
          "Établir les garanties offertes",
          "Préciser les recours en cas de litige",
          "Conformité avec le Code de la consommation sénégalais",
          "Faire valider par un avocat"
        ]
      },
      "Litiges commerciaux": {
        title: "Litiges commerciaux",
        description: "Gestion et résolution des litiges avec les clients ou partenaires",
        importance: "MOYENNE - Gestion proactive des conflits",
        steps: [
          "Établir une procédure de médiation amiable",
          "Définir la juridiction compétente",
          "Prévoir les modes alternatifs de règlement (arbitrage)",
          "Documenter tous les échanges en cas de litige",
          "Constituer un dossier juridique complet",
          "Consulter un avocat dès les premiers signes"
        ]
      },
      "Négociations partenariats": {
        title: "Négociations partenariats",
        description: "Cadre juridique pour les partenariats stratégiques",
        importance: "MOYENNE - Sécurisation des collaborations",
        steps: [
          "Définir les objectifs du partenariat",
          "Rédiger une lettre d'intention",
          "Négocier les clauses de confidentialité",
          "Établir le partage des responsabilités",
          "Définir les modalités de sortie",
          "Rédiger un accord de partenariat complet",
          "Validation juridique avant signature"
        ]
      },
      "Dépôt de marque": {
        title: "Dépôt de marque",
        description: "Protection juridique de la marque FinderID",
        importance: "CRITIQUE - Protection de l'identité et de la valeur de la marque",
        steps: [
          "Vérifier la disponibilité de la marque (recherche d'antériorités)",
          "Définir les classes de protection (services couverts)",
          "Déposer auprès de l'OAPI (Organisation Africaine de la Propriété Intellectuelle)",
          "Obtenir le certificat d'enregistrement",
          "Surveiller les éventuelles contrefaçons",
          "Renouveler tous les 10 ans",
          "Considérer l'extension internationale si nécessaire"
        ],
        ressources: ["OAPI - Procédure de dépôt", "Liste des classes de Nice"]
      },
      "Protection du nom de domaine": {
        title: "Protection du nom de domaine",
        description: "Sécurisation et protection des noms de domaine",
        importance: "HAUTE - Protection de l'identité en ligne",
        steps: [
          "Enregistrer les variantes du nom de domaine (.sn, .com, .africa)",
          "Activer le verrouillage du domaine",
          "Configurer le renouvellement automatique",
          "Protéger les informations WHOIS",
          "Surveiller les enregistrements similaires",
          "Documenter la propriété du domaine"
        ]
      },
      "Droits d'auteur sur le contenu": {
        title: "Droits d'auteur sur le contenu",
        description: "Protection des contenus originaux créés (textes, images, code)",
        importance: "MOYENNE - Protection de la création intellectuelle",
        steps: [
          "Identifier tous les contenus originaux",
          "Apposer les mentions de copyright (© FinderID 2025)",
          "Documenter la création (dates, auteurs)",
          "Définir les licences d'utilisation",
          "Mettre en place une surveillance anti-plagiat",
          "Établir des CGU claires sur l'utilisation du contenu",
          "Enregistrer les œuvres majeures si nécessaire"
        ]
      },
      "Licences logicielles": {
        title: "Licences logicielles",
        description: "Conformité et gestion des licences de logiciels utilisés",
        importance: "HAUTE - Éviter les risques de contrefaçon",
        steps: [
          "Inventorier tous les logiciels utilisés",
          "Vérifier la conformité des licences open-source",
          "S'assurer du respect des conditions d'utilisation",
          "Documenter toutes les licences",
          "Former l'équipe sur les restrictions",
          "Mettre en place une politique d'achat de licences",
          "Auditer régulièrement la conformité"
        ]
      },
      "Assurance responsabilité civile professionnelle": {
        title: "Assurance responsabilité civile professionnelle",
        description: "Couverture des dommages causés dans le cadre de l'activité",
        importance: "CRITIQUE - Protection financière de l'entreprise",
        steps: [
          "Évaluer les risques spécifiques de l'activité",
          "Comparer les offres d'assurance au Sénégal",
          "Définir le montant de garantie nécessaire",
          "Vérifier les exclusions de garantie",
          "Souscrire le contrat adapté",
          "Déclarer rapidement tout sinistre",
          "Revoir annuellement les garanties"
        ]
      },
      "Assurance cyber-risques": {
        title: "Assurance cyber-risques",
        description: "Protection contre les risques informatiques et cybersécurité",
        importance: "HAUTE - Protection contre les cyberattaques",
        steps: [
          "Identifier les cyber-risques (piratage, fuite de données, ransomware)",
          "Évaluer l'exposition financière potentielle",
          "Souscrire une cyber-assurance adaptée",
          "Vérifier la couverture (interruption d'activité, frais de notification)",
          "Mettre en place les mesures de prévention requises",
          "Former l'équipe à la gestion de crise cyber",
          "Tester le plan de réponse aux incidents"
        ]
      },
      "Clauses de limitation de responsabilité": {
        title: "Clauses de limitation de responsabilité",
        description: "Limitation légale de la responsabilité de l'entreprise",
        importance: "HAUTE - Protection juridique",
        steps: [
          "Analyser les risques potentiels de responsabilité",
          "Rédiger des clauses équilibrées et légales",
          "Exclure la responsabilité pour faute d'un tiers",
          "Limiter les dommages indemnisables",
          "Assurer la visibilité et acceptation des clauses",
          "Vérifier la conformité avec le droit sénégalais",
          "Faire valider par un avocat"
        ]
      },
      "Gestion des réclamations": {
        title: "Gestion des réclamations",
        description: "Processus de traitement des réclamations clients",
        importance: "MOYENNE - Satisfaction client et prévention des litiges",
        steps: [
          "Créer un canal dédié aux réclamations",
          "Définir un délai de réponse (ex: 7 jours)",
          "Former l'équipe à la gestion des conflits",
          "Documenter chaque réclamation",
          "Analyser les réclamations récurrentes",
          "Mettre en place des actions correctives",
          "Mesurer la satisfaction post-traitement"
        ]
      },
      "Contrats de travail": {
        title: "Contrats de travail",
        description: "Rédaction et gestion des contrats de travail conformes",
        importance: "HAUTE - Conformité avec le Code du Travail sénégalais",
        steps: [
          "Choisir le type de contrat adapté (CDI, CDD, stage)",
          "Inclure les clauses obligatoires (poste, rémunération, durée)",
          "Ajouter les clauses spécifiques (confidentialité, non-concurrence)",
          "Vérifier la conformité avec la convention collective",
          "Faire signer avant le début du contrat",
          "Conserver les originaux",
          "Enregistrer auprès de l'inspection du travail si requis"
        ]
      },
      "Règlement intérieur": {
        title: "Règlement intérieur",
        description: "Document définissant les règles de fonctionnement interne",
        importance: "MOYENNE - Organisation et discipline au travail",
        steps: [
          "Définir les horaires et organisation du travail",
          "Établir les règles d'hygiène et sécurité",
          "Préciser les sanctions disciplinaires",
          "Définir les droits et devoirs des employés",
          "Faire valider par l'inspection du travail",
          "Afficher et communiquer à tous les employés",
          "Mettre à jour selon l'évolution de l'entreprise"
        ]
      },
      "Formation sécurité": {
        title: "Formation sécurité",
        description: "Formation obligatoire des employés à la sécurité",
        importance: "OBLIGATOIRE - Conformité légale et protection des employés",
        steps: [
          "Identifier les risques par poste de travail",
          "Organiser la formation à l'embauche",
          "Former aux gestes de premiers secours",
          "Sensibiliser aux risques incendie",
          "Former à l'utilisation des équipements",
          "Documenter les formations réalisées",
          "Prévoir des recyclages réguliers"
        ]
      },
      "Gestion des conflits": {
        title: "Gestion des conflits",
        description: "Processus de résolution des conflits internes",
        importance: "MOYENNE - Climat de travail sain",
        steps: [
          "Établir une procédure d'alerte et de médiation",
          "Désigner des médiateurs internes",
          "Former les managers à la gestion de conflits",
          "Favoriser le dialogue et l'écoute",
          "Documenter les situations problématiques",
          "Recourir à l'inspection du travail si nécessaire",
          "Suivre la résolution et prévenir les récidives"
        ]
      }
    };

    return actionDetailsMap[actionTitle] || {
      title: actionTitle,
      description: "Détails à venir",
      importance: "À définir",
      steps: ["Information en cours de préparation"],
      ressources: []
    };
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
                  <p className="text-xs font-medium mb-2">Actions requises:</p>
                  {area.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => setSelectedAction(getActionDetails(action))}
                      className="w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-2"
                    >
                      <Info className="h-3 w-3 flex-shrink-0" />
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setSelectedArea(area)}
                >
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
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleContactLawyer}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contacter avocat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMarkComplete(task.title)}
                    disabled={completedTasks.includes(task.title)}
                  >
                    {completedTasks.includes(task.title) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Terminé
                      </>
                    ) : (
                      "Marquer terminé"
                    )}
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

      {/* Dialog pour les détails d'un domaine juridique */}
      <Dialog open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              {selectedArea?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedArea?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={getPriorityColor(selectedArea?.priority || '')}>
                Priorité: {selectedArea?.priority}
              </Badge>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedArea?.status || '')}`}></div>
                <span className="text-sm font-medium">
                  Statut: {selectedArea?.status === 'ok' ? 'Conforme' : selectedArea?.status === 'attention' ? 'À surveiller' : 'Urgent'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Actions requises:</h4>
              <div className="space-y-2">
                {selectedArea?.actions?.map((action: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAction(getActionDetails(action))}
                    className="w-full flex items-start gap-2 p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left"
                  >
                    <Info className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleContactLawyer} className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Contacter un avocat
              </Button>
              <Button variant="outline" onClick={() => setSelectedArea(null)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour les détails d'une action spécifique */}
      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {selectedAction?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedAction?.description}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Importance */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {selectedAction?.importance}
                </p>
              </div>

              {/* Étapes détaillées */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Étapes à suivre:
                </h4>
                <ol className="space-y-2">
                  {selectedAction?.steps?.map((step, index) => (
                    <li key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
                      <span className="font-semibold text-blue-600 flex-shrink-0">{index + 1}.</span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Ressources */}
              {selectedAction?.ressources && selectedAction.ressources.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    Ressources utiles:
                  </h4>
                  <ul className="space-y-2">
                    {selectedAction.ressources.map((ressource, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                        <span className="text-purple-600">•</span>
                        <span className="text-sm">{ressource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleContactLawyer} className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Consulter un avocat
            </Button>
            <Button variant="outline" onClick={() => setSelectedAction(null)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};