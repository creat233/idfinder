import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  text: string;
  isCurrentUser: boolean;
}

type Lang = "fr" | "en";

export function MessageTranslateButton({ text, isCurrentUser }: Props) {
  const { toast } = useToast();
  const [translations, setTranslations] = useState<Partial<Record<Lang, string>>>({});
  const [activeLang, setActiveLang] = useState<Lang | null>(null);
  const [loadingLang, setLoadingLang] = useState<Lang | null>(null);

  const handleTranslate = async (lang: Lang) => {
    if (activeLang === lang) {
      setActiveLang(null);
      return;
    }
    if (translations[lang]) {
      setActiveLang(lang);
      return;
    }
    setLoadingLang(lang);
    try {
      const { data, error } = await supabase.functions.invoke("translate-message", {
        body: { text, targetLang: lang },
      });
      if (error) throw error;
      if (data?.translation) {
        setTranslations((prev) => ({ ...prev, [lang]: data.translation }));
        setActiveLang(lang);
      } else {
        throw new Error("Empty translation");
      }
    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Traduction impossible", description: e?.message ?? "Erreur" });
    } finally {
      setLoadingLang(null);
    }
  };

  const shown = activeLang ? translations[activeLang] : null;

  return (
    <div className={`mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
      {shown && (
        <p
          className={`text-[13px] italic px-2 py-1 rounded-md mb-1 ${
            isCurrentUser ? "bg-blue-50 text-blue-900" : "bg-gray-50 text-gray-800"
          }`}
        >
          {shown}
        </p>
      )}
      <div className={`inline-flex items-center gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
        {(["fr", "en"] as Lang[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleTranslate(lang)}
            className={`inline-flex items-center gap-1 text-[11px] transition ${
              activeLang === lang ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {loadingLang === lang ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Languages className="h-3 w-3" />
            )}
            {lang === "fr" ? "Français" : "English"}
          </button>
        ))}
      </div>
    </div>
  );
}
