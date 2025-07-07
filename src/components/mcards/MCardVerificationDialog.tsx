import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Upload, CreditCard, AlertTriangle } from "lucide-react";
import { createVerificationRequest } from "@/services/mcardVerificationService";

interface MCardVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mcardId: string;
  mcardName: string;
}

export const MCardVerificationDialog = ({ 
  isOpen, 
  onOpenChange, 
  mcardId, 
  mcardName 
}: MCardVerificationDialogProps) => {
  const [step, setStep] = useState(1);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [nineaDocument, setNineaDocument] = useState<File | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleIdDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 5MB"
        });
        return;
      }
      setIdDocument(file);
    }
  };

  const handleNineaDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 5MB"
        });
        return;
      }
      setNineaDocument(file);
    }
  };

  const handleSubmit = async () => {
    if (!idDocument) {
      toast({
        variant: "destructive",
        title: "Document manquant",
        description: "Veuillez télécharger votre pièce d'identité"
      });
      return;
    }

    if (!paymentConfirmed) {
      toast({
        variant: "destructive",
        title: "Paiement requis",
        description: "Veuillez confirmer le paiement des frais de vérification"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createVerificationRequest(mcardId, {
        id_document: idDocument,
        ninea_document: nineaDocument || undefined,
        payment_confirmed: paymentConfirmed
      });

      if (result.success) {
        toast({
          title: "✅ Demande envoyée !",
          description: "Votre demande de vérification a été envoyée. Vous recevrez une notification une fois traitée."
        });
        onOpenChange(false);
        resetForm();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Une erreur s'est produite"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIdDocument(null);
    setNineaDocument(null);
    setPaymentConfirmed(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            Demande de vérification MCard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations sur la vérification */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🏆 Pourquoi vérifier votre MCard ?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Badge "Vérifié" visible sur votre carte</li>
              <li>• Meilleure visibilité et crédibilité</li>
              <li>• Confiance accrue des clients</li>
              <li>• Apparition dans la section "MCards Vérifiées"</li>
            </ul>
          </div>

          {/* Prix */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-green-900">Frais de vérification</span>
            </div>
            <div className="text-3xl font-bold text-green-600">5 000 FCFA</div>
            <p className="text-sm text-green-700 mt-1">Paiement unique pour la vérification</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Étape 1 : Documents requis</h3>
              
              {/* Document d'identité */}
              <div>
                <Label htmlFor="id_document" className="text-sm font-medium">
                  Pièce d'identité (CNI, Passeport) *
                </Label>
                <div className="mt-1">
                  <Input
                    id="id_document"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdDocumentChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {idDocument && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {idDocument.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Document NINEA (optionnel) */}
              <div>
                <Label htmlFor="ninea_document" className="text-sm font-medium">
                  Document NINEA (optionnel - pour les entreprises)
                </Label>
                <div className="mt-1">
                  <Input
                    id="ninea_document"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleNineaDocumentChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {nineaDocument && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {nineaDocument.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!idDocument}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Étape 2 : Paiement</h3>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium mb-1">Instructions de paiement :</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Effectuez un paiement de 5 000 FCFA via Orange Money, Wave ou virement</li>
                      <li>Numéro de paiement : <strong>+221 77 XXX XX XX</strong></li>
                      <li>Référence : <strong>VERIF-{mcardId.slice(-8).toUpperCase()}</strong></li>
                      <li>Cochez la case ci-dessous après paiement</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="payment_confirmed"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="payment_confirmed" className="text-sm">
                  J'ai effectué le paiement de 5 000 FCFA et je confirme la transaction
                </Label>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!paymentConfirmed || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Envoi..." : "Envoyer la demande"}
                </Button>
              </div>
            </div>
          )}

          {/* Informations sur le processus */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">📋 Processus de vérification</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. Soumission de votre demande avec documents</p>
              <p>2. Vérification par notre équipe (24-48h)</p>
              <p>3. Validation et activation du badge "Vérifié"</p>
              <p>4. Notification de confirmation</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};