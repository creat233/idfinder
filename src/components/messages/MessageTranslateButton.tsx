import { useState, useMemo } from "react";
import { Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  text: string;
  isCurrentUser: boolean;
}

type Lang = "fr" | "en";

// Simple French vs English detector based on common tokens/accents.
function detectLang(text: string): Lang {
  const t = text.toLowerCase();
  if (/[àâçéèêëîïôùûüÿœ]/.test(t)) return "fr";
  const frWords = /\b(le|la|les|un|une|des|je|tu|il|elle|nous|vous|ils|est|suis|c'est|bonjour|merci|oui|non|avec|pour|sur|dans|mais|donc|très|plus|moins)\b/;
  const enWords = /\b(the|and|is|are|you|i'm|hello|thanks|thank|yes|no|with|for|on|in|but|so|very|more|less|what|how|why)\b/;
  const fr = (t.match(frWords) || []).length;
  const en = (t.match(enWords) || []).length;
  return en > fr ? "en" : "fr";
}

export function MessageTranslateButton({ text, isCurrentUser }: Props) {
  const { toast } = useToast();
  const [translation, setTranslation] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);

  const sourceLang = useMemo(() => detectLang(text), [text]);
  const targetLang: Lang = sourceLang === "fr" ? "en" : "fr";
  const label = targetLang === "fr" ? "Traduire en Français" : "Translate to English";

  const handleTranslate = async () => {
    if (shown) {
      setShown(false);
      return;
    }
    if (translation) {
      setShown(true);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-message", {
        body: { text, targetLang },
      });
      if (error) throw error;
      if (data?.translation) {
        setTranslation(data.translation);
        setShown(true);
      } else {
        throw new Error("Empty translation");
      }
    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Traduction impossible", description: e?.message ?? "Erreur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
      {shown && translation && (
        <p
          className={`text-[13px] italic px-2 py-1 rounded-md mb-1 ${
            isCurrentUser ? "bg-blue-50 text-blue-900" : "bg-gray-50 text-gray-800"
          }`}
        >
          {translation}
        </p>
      )}
      <button
        type="button"
        onClick={handleTranslate}
        className={`inline-flex items-center gap-1 text-[11px] transition ${
          shown ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-blue-600"
        }`}
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Languages className="h-3 w-3" />}
        {shown ? "Masquer la traduction" : label}
      </button>
    </div>
  );
}
