
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Support = () => {
  const navigate = useNavigate();
  const supportEmail = "mcard1100@gmail.com";

  const handleContactSupport = () => {
    window.location.href = `mailto:${supportEmail}`;
  };

  const handleEmergencyNumbers = () => {
    navigate('/numeros-urgence');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-center mb-12">Assistance et FAQ</h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <Card className="p-8 text-center flex-1">
                <MessageSquare className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
                <p className="text-gray-600 mb-6">
                  Notre équipe d'assistance est disponible pour répondre à toutes vos questions<br />
                  Email: {supportEmail}
                </p>
                <Button size="lg" onClick={handleContactSupport}>Contacter le support</Button>
              </Card>
              
              <Card className="p-8 text-center flex-1 border-primary/20">
                <PhoneCall className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Numéros d'Urgence</h2>
                <p className="text-gray-600 mb-6">
                  Accédez rapidement aux numéros d'urgence<br />
                  disponibles au Sénégal
                </p>
                <Button size="lg" onClick={handleEmergencyNumbers} variant="destructive">
                  Voir les numéros d'urgence
                </Button>
              </Card>
            </div>
            
            <Accordion type="single" collapsible className="mb-12">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment fonctionne la récompense ?</AccordionTrigger>
                <AccordionContent>
                  Vous recevez 2000 Fr pour chaque carte d'identité restituée à son propriétaire légitime. La récompense est versée une fois que le propriétaire a payé les frais de récupération de 5000 Fr.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Comment signaler une carte trouvée ?</AccordionTrigger>
                <AccordionContent>
                  Utilisez notre formulaire en ligne pour signaler une carte trouvée. Vous devrez fournir des informations sur le lieu et la date de découverte. Une photo de la carte peut être ajoutée pour accélérer le processus de vérification.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Comment sont protégées les données personnelles ?</AccordionTrigger>
                <AccordionContent>
                  Nous utilisons des protocoles de sécurité avancés pour protéger toutes les données personnelles. Les informations sensibles sont cryptées et l'accès est strictement contrôlé.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
