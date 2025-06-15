
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MyCardsAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyCardsAdModal = ({ isOpen, onClose }: MyCardsAdModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publicité</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="mb-4">Visitez notre partenaire pour tous vos besoins médicaux.</p>
          <a 
            href="https://medickane.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-bold text-blue-600">Clinique Médicale Medic'kane</h3>
            <p className="text-sm text-gray-500">Votre santé, notre priorité.</p>
          </a>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Continuer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
