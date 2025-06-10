
export type Country = "SN" | "FR" | "US" | "CA";
export type Language = "fr" | "en";

export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}
