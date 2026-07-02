import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";

interface Props {
  text: string;
  isCurrentUser: boolean;
}

export function MessageTranslateButton({ text, isCurrentUser }: Props) {
  const { currentLanguage } = useTranslation();
  const { toast } = useToast();
  const [translation, setTranslation] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (translation) {
      setShowOriginal((v) => !v);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: { text, targetLang: currentLanguage },
      });
      if (error) throw error;
      if (data?.translation) {
        setTranslation(data.translation);
      } else {
        throw new Error('Empty translation');
      }
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Traduction impossible', description: e?.message ?? 'Erreur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
      {translation && !showOriginal && (
        <p className={`text-[13px] italic px-2 py-1 rounded-md mb-1 ${isCurrentUser ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-800'}`}>
          {translation}
        </p>
      )}
      <button
        type="button"
        onClick={handleTranslate}
        className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-blue-600 transition"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Languages className="h-3 w-3" />}
        {loading
          ? 'Traduction...'
          : translation
            ? (showOriginal ? 'Voir la traduction' : 'Voir l\u2019original')
            : 'Traduire'}
      </button>
    </div>
  );
}
