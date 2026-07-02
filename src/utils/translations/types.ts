
export type Country = "SN" | "CI" | "ML" | "BF" | "NE" | "TG" | "BJ" | "GW" | "GN" | "MR" | "GM" | "SL" | "LR" | "GH" | "NG" | "MA" | "DZ" | "TN" | "EG" | "LY" | "FR" | "ES" | "IT" | "DE" | "BE" | "PT" | "NL" | "CH" | "GB" | "CA" | "US" | "CV" | "CM" | "GA" | "CD";
export type Language = "fr" | "en" | "es" | "pt" | "ar" | "wo" | "de" | "it" | "zh" | "ru";

export interface Translations {
  [key: string]: {
    fr: string;
    en?: string;
    es?: string;
    pt?: string;
    ar?: string;
    wo?: string;
    de?: string;
    it?: string;
    zh?: string;
    ru?: string;
  };
}

