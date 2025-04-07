
import { motion } from "framer-motion";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { CreditCard, FileText, Building } from "lucide-react";

export const SenegaleseDocuments = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="my-12"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-2xl font-semibold mb-6"
      >
        Documents d&apos;identité et administratifs au Sénégal
      </motion.h2>

      <motion.p 
        variants={itemVariants}
        className="text-gray-600 mb-8"
      >
        Pour obtenir ou renouveler vos documents d&apos;identité tels que la carte nationale d&apos;identité, 
        le passeport ordinaire et le permis de construire au Sénégal, voici les procédures à suivre, 
        ainsi que les démarches en cas de perte de ces documents.
      </motion.p>

      <Accordion type="single" collapsible className="w-full">
        <motion.div variants={itemVariants}>
          <Card className="mb-4 overflow-hidden border-l-4 border-l-blue-500">
            <AccordionItem value="cni" className="border-none">
              <AccordionTrigger className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Carte nationale d&apos;identité (CNI)</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Obtention pour la première fois:</h4>
                    <div className="space-y-2">
                      <p className="font-medium">Documents requis:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Acte de naissance de l&apos;intéressé</li>
                        <li>Carte nationale d&apos;identité de l&apos;un des parents (pour les mineurs)</li>
                        <li>Quittance de paiement des frais de timbre</li>
                      </ul>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="font-medium">Procédure:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Se présenter à la mairie de votre lieu de résidence avec les documents requis</li>
                        <li>Remplir le formulaire de demande fourni par la mairie</li>
                        <li>Payer les frais de timbre et obtenir la quittance correspondante</li>
                        <li>Le délai de délivrance est généralement de 15 jours</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">En cas de perte ou de vol:</h4>
                    <div className="space-y-2">
                      <p className="font-medium">Procédure:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Déposer une plainte auprès du commissariat de police de votre localité</li>
                        <li>Présenter la plainte au service de l&apos;état civil de votre mairie</li>
                        <li>Fournir les documents requis pour une nouvelle demande de CNI</li>
                        <li>Suivre la procédure d&apos;obtention pour la première fois</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mb-4 overflow-hidden border-l-4 border-l-green-500">
            <AccordionItem value="passport" className="border-none">
              <AccordionTrigger className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Passeport ordinaire</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Obtention pour la première fois:</h4>
                    <div className="space-y-2">
                      <p className="font-medium">Documents requis:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Carte nationale d&apos;identité (originale et copie certifiée conforme)</li>
                        <li>Trois photos d&apos;identité en couleur</li>
                        <li>Quittance de paiement des frais de timbre (20 000 FCFA) auprès de la Direction de l&apos;Enregistrement, des Domaines et du Timbre</li>
                      </ul>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="font-medium">Procédure:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Payer les frais de timbre à la Direction de l&apos;Enregistrement, des Domaines et du Timbre et obtenir la quittance</li>
                        <li>Prendre rendez-vous en appelant le serveur vocal Africatel AVS au 88 628 19 01 (appel surtaxé)</li>
                        <li>Le jour du rendez-vous, se présenter au commissariat de police de votre localité avec tous les documents requis</li>
                        <li>Le délai de délivrance est généralement de 1 à 2 semaines</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">En cas de perte ou de vol:</h4>
                    <div className="space-y-2">
                      <p className="font-medium">Procédure:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Déposer une déclaration de perte auprès du commissariat de police de votre domicile</li>
                        <li>Effectuer une nouvelle demande de passeport en suivant la procédure standard, car un duplicata n&apos;est pas délivré</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mb-4 overflow-hidden border-l-4 border-l-orange-500">
            <AccordionItem value="permit" className="border-none">
              <AccordionTrigger className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-medium">Permis de construire</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Obtention:</h4>
                    <div className="space-y-2">
                      <p className="font-medium">Documents requis:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Demande manuscrite adressée au maire de la commune concernée</li>
                        <li>Copie du titre de propriété du terrain</li>
                        <li>Plans de situation et de délimitation du terrain certifiés par le service du Cadastre</li>
                        <li>Cinq jeux de plans de construction architecturaux à l&apos;échelle 1/100e</li>
                        <li>Fiche de renseignement sur le projet</li>
                        <li>Devis descriptif du projet</li>
                        <li>Plan de fosses septiques ou indication du système d&apos;évacuation des eaux usées</li>
                        <li>Taxe d&apos;urbanisme (entre 1 000 et 5 000 FCFA) et timbre fiscal de 1 000 FCFA</li>
                      </ul>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="font-medium">Procédure:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Soumettre le dossier complet au service d&apos;urbanisme de la commune concernée</li>
                        <li>Le délai d&apos;étude du dossier est d&apos;environ 3 mois</li>
                        <li>Dans la région de Dakar, la procédure peut être dématérialisée via la plateforme TéléDac, réduisant le délai à 28 jours pour les dossiers simples et 40 jours pour les dossiers complexes</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">En cas de perte:</h4>
                    <div className="space-y-2">
                      <p className="font-medium">Procédure:</p>
                      <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Obtenir un certificat de perte auprès des autorités compétentes</li>
                        <li>Faire une demande de duplicata du permis de construire en présentant le certificat de perte</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        </motion.div>
      </Accordion>

      <motion.div 
        variants={itemVariants}
        className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        <p className="text-gray-600 text-sm">
          <strong>Remarques:</strong> Les procédures peuvent varier légèrement selon les communes et les spécificités de chaque dossier.
          Il est recommandé de contacter les services compétents pour obtenir des informations à jour et spécifiques à votre situation.
          Pour plus de détails, vous pouvez consulter les sites officiels tels que <a href="https://senegalservices.sn" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Sénégal Services</a> et le <a href="https://interieur.gouv.sn" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ministère de l&apos;Intérieur</a>.
        </p>
      </motion.div>
    </motion.div>
  );
};
