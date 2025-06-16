
import * as z from "zod";

export const formSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  slug: z.string().min(3, "Le slug est requis").regex(/^[a-z0-9-]+$/, "Slug invalide (lettres minuscules, chiffres et tirets)"),
  job_title: z.string().optional(),
  company: z.string().optional(),
  description: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  website_url: z.string().url("URL invalide").optional().or(z.literal('')),
  linkedin_url: z.string().url("URL LinkedIn invalide").optional().or(z.literal('')),
  twitter_url: z.string().url("URL Twitter invalide").optional().or(z.literal('')),
  facebook_url: z.string().url("URL Facebook invalide").optional().or(z.literal('')),
  instagram_url: z.string().url("URL Instagram invalide").optional().or(z.literal('')),
  youtube_url: z.string().url("URL YouTube invalide").optional().or(z.literal('')),
  tiktok_url: z.string().url("URL TikTok invalide").optional().or(z.literal('')),
  is_published: z.boolean().default(false),
});

export type MCardFormData = z.infer<typeof formSchema>;
