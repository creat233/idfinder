
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface SupportSectionProps {
  handleContactSupport: () => void;
}

export const SupportSection = ({ handleContactSupport }: SupportSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">{t('supportAndFaq')}</h2>
      <Button
        variant="outline"
        onClick={handleContactSupport}
        className="w-full flex items-center justify-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        {t('contactSupport')}
      </Button>
    </div>
  );
};
