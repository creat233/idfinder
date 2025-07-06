import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Upload, CreditCard, FileText, AlertTriangle } from "lucide-react";
import { createVerificationRequest, getUserVerificationStatus } from "@/services/mcardVerificationService";
import { VerificationFormData } from "@/types/mcard-verification";
import { useToast } from "@/hooks/use-toast";

const VerificationRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mcardId = searchParams.get('mcardId');
  
  const [formData, setFormData] = useState<Partial<VerificationFormData>>({
    payment_confirmed: false
  });
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mcardId) {
      navigate('/mcards');
      return;
    }
    
    checkCurrentStatus();
  }, [mcardId, navigate]);

  const checkCurrentStatus = async () => {
    if (!mcardId) return;
    
    const status = await getUserVerificationStatus(mcardId);
    setCurrentStatus(status);
  };

  const handleFileChange = (field: 'id_document' | 'ninea_document', file: File | null) => {
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mcardId || !formData.id_document) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez fournir tous les documents requis"
      });
      return;
    }

    if (!formData.payment_confirmed) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez confirmer le paiement avant de continuer"
      });
      return;
    }

    setLoading(true);
    
    const result = await createVerificationRequest(mcardId, formData as VerificationFormData);
    
    if (result.success) {
      toast({
        title: "Demande envoyée !",
        description: "Votre demande de vérification a été envoyée avec succès"
      });
      navigate('/mcards');
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: result.error || "Impossible d'envoyer la demande"
      });
    }
    
    setLoading(false);
  };

  // Rediriger si déjà en cours ou approuvé
  if (currentStatus && currentStatus !== 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  {currentStatus === 'approved' ? 'Carte vérifiée' : 'Demande en cours'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {currentStatus === 'approved' 
                    ? 'Votre carte est déjà vérifiée et porte le badge officiel.'
                    : 'Votre demande de vérification est en cours de traitement par notre équipe.'
                  }
                </p>
                <Button onClick={() => navigate('/mcards')}>
                  Retour à mes cartes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Demande de Vérification
            </h1>
            <p className="text-lg text-gray-600">
              Obtenez le badge "Vérifié" pour votre MCard
            </p>
          </div>

          {/* Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Avantages de la vérification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Badge "Vérifié" visible sur votre carte
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Augmentation de la confiance des clients
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Mise en avant dans les résultats de recherche
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Authentification officielle de votre identité
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-600" />
                Frais de vérification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">5 000 FCFA</div>
                <p className="text-gray-600">Paiement unique pour la vérification</p>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Documents requis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ID Document */}
                <div className="space-y-2">
                  <Label htmlFor="id_document" className="text-base font-medium">
                    Pièce d'identité (obligatoire) *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Input
                      id="id_document"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange('id_document', e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                    <Label htmlFor="id_document" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700">
                        Cliquez pour sélectionner votre pièce d'identité
                      </span>
                    </Label>
                    <p className="text-sm text-gray-500 mt-2">
                      Carte nationale d'identité, passeport, permis de conduire...
                    </p>
                    {formData.id_document && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {formData.id_document.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* NINEA Document */}
                <div className="space-y-2">
                  <Label htmlFor="ninea_document" className="text-base font-medium">
                    NINEA (optionnel)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Input
                      id="ninea_document"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange('ninea_document', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Label htmlFor="ninea_document" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700">
                        Cliquez pour sélectionner votre NINEA
                      </span>
                    </Label>
                    <p className="text-sm text-gray-500 mt-2">
                      Document optionnel mais recommandé pour les entreprises
                    </p>
                    {formData.ninea_document && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {formData.ninea_document.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Confirmation */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="font-medium">Instructions de paiement:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Effectuez un paiement de 5 000 FCFA via Orange Money ou Wave</li>
                        <li>Numéro de paiement: <strong>77 123 45 67</strong></li>
                        <li>Conservez le reçu de transaction</li>
                        <li>Cochez la case ci-dessous pour confirmer votre paiement</li>
                      </ol>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          id="payment_confirmed"
                          type="checkbox"
                          checked={formData.payment_confirmed}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            payment_confirmed: e.target.checked 
                          }))}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="payment_confirmed" className="text-sm">
                          Je confirme avoir effectué le paiement de 5 000 FCFA
                        </Label>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/mcards')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.payment_confirmed}
                    className="flex-1"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer la demande"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequest;