import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PrivacyPolicyContent } from "./PrivacyPolicyContent";
import { TermsOfServiceContent } from "./TermsOfServiceContent";
import { CodeOfConductContent } from "./CodeOfConductContent";

interface LegalDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: "privacy" | "terms" | "conduct";
}

export const LegalDocumentDialog = ({ isOpen, onClose, documentType }: LegalDocumentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[1000px] h-[85vh] max-h-[85vh] p-0">
        {documentType === "privacy" && <PrivacyPolicyContent />}
        {documentType === "terms" && <TermsOfServiceContent />}
        {documentType === "conduct" && <CodeOfConductContent />}
      </DialogContent>
    </Dialog>
  );
};
