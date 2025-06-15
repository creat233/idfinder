
export type Country = "SN" | "CI" | "ML" | "BF" | "NE" | "TG" | "BJ" | "GW" | "GN" | "MR" | "GM" | "SL" | "LR" | "GH" | "NG" | "MA" | "DZ" | "TN" | "EG" | "LY" | "FR" | "ES" | "IT" | "DE" | "BE" | "PT" | "NL" | "CH" | "GB" | "CA" | "US" | "CV";
export type Language = "fr" | "en";

export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}
