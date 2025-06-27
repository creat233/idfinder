
import * as z from "zod";

export const formSchema = z.object({
  full_name: z.string().min(1, "Le nom complet est requis").trim(),
  job_title: z.string().optional(),
  company: z.string().optional(),
  description: z.string().optional(),
  phone_number: z.string().min(1, "Le numéro de téléphone est requis").trim(),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  website_url: z.string().url("URL invalide").optional().or(z.literal('')),
  linkedin_url: z.string().url("URL LinkedIn invalide").optional().or(z.literal('')),
  twitter_url: z.string().url("URL Twitter invalide").optional().or(z.literal('')),
  facebook_url: z.string().url("URL Facebook invalide").optional().or(z.literal('')),
  instagram_url: z.string().url("URL Instagram invalide").optional().or(z.literal('')),
  youtube_url: z.string().url("URL YouTube invalide").optional().or(z.literal('')),
  tiktok_url: z.string().url("URL TikTok invalide").optional().or(z.literal('')),
  snapchat_url: z.string().url("URL Snapchat invalide").optional().or(z.literal('')),
  telegram_url: z.string().url("URL Telegram invalide").optional().or(z.literal('')),
  google_business_url: z.string().url("URL Google Business invalide").optional().or(z.literal('')),
  is_published: z.boolean().default(false),
});

export type MCardFormData = z.infer<typeof formSchema>;
