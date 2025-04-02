
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneCall, ArrowLeft, PhoneForwarded } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type EmergencyNumberType = {
  service: string;
  number: string;
  description: string;
}

const NumeroUrgence = () => {
  const navigate = useNavigate();

  const emergencyNumbers: EmergencyNumberType[] = [
    { 
      service: "Police Nationale", 
      number: "17", 
      description: "Pour signaler un crime, un délit ou une situation dangereuse" 
    },
    { 
      service: "Sapeurs-Pompiers", 
      number: "18", 
      description: "Pour les urgences médicales, les incendies et les secours" 
    },
    { 
      service: "SAMU (Service d'Aide Médicale Urgente)", 
      number: "1515", 
      description: "Pour les urgences médicales graves nécessitant une intervention médicale" 
    },
    { 
      service: "Gendarmerie", 
      number: "800 00 20 20", 
      description: "Numéro vert de la Gendarmerie Nationale" 
    },
    { 
      service: "Centre Anti-Poison", 
      number: "818 00 15 15", 
      description: "Pour les cas d'empoisonnement ou d'intoxication" 
    },
    { 
      service: "SOS Médecin", 
      number: "33 889 15 15", 
      description: "Service de médecins à domicile disponible 24h/24" 
    },
    { 
      service: "Croix-Rouge Sénégalaise", 
      number: "33 823 39 92", 
      description: "Assistance humanitaire et premiers secours" 
    },
    { 
      service: "Protection Civile", 
      number: "33 889 31 00", 
      description: "Pour les catastrophes naturelles et situations d'urgence collective" 
    }
  ];

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
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

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Numéros d'Urgence au Sénégal</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En cas d'urgence, contactez immédiatement les services appropriés. Ces numéros sont disponibles 24h/24 et 7j/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyNumbers.map((item, index) => (
              <Card key={index} className="overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl mb-2">{item.service}</h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    </div>
                    <PhoneCall className="text-primary h-6 w-6 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-primary">{item.number}</span>
                    <Button 
                      onClick={() => handleCall(item.number)}
                      className="flex items-center gap-2"
                    >
                      <PhoneForwarded size={16} />
                      Appeler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Conseils en cas d'urgence</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Restez calme et parlez clairement lors de votre appel d'urgence</li>
              <li>Précisez votre localisation exacte</li>
              <li>Décrivez brièvement la situation d'urgence</li>
              <li>Suivez les instructions données par les opérateurs</li>
              <li>Ne raccrochez pas avant que l'opérateur ne vous y invite</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NumeroUrgence;
