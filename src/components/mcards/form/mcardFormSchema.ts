
import * as z from "zod";

export const formSchema = z.object({
  full_name: z.string().min(1, "Le nom complet est requis").trim(),
  job_title: z.string().optional(),
  company: z.string().optional(),
  description: z.string().optional(),
  phone_number: z.string().min(1, "Le numéro de téléphone est requis").trim(),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  website_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  linkedin_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  twitter_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  facebook_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  instagram_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  youtube_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  tiktok_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  snapchat_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  telegram_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  google_business_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  maps_location_url: z.string().optional().transform(val => val?.trim() === '' ? undefined : val),
  is_published: z.boolean().default(false),
});

export type MCardFormData = z.infer<typeof formSchema>;
