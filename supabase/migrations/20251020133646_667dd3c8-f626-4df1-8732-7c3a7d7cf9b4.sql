-- Créer une carte démo pour sponsors@gmail.com
INSERT INTO public.mcards (
  user_id,
  slug,
  full_name,
  job_title,
  company,
  description,
  phone_number,
  email,
  plan,
  subscription_status,
  is_published,
  subscription_expires_at
) VALUES (
  'f993334d-8f48-42ec-b467-97c0070111af', -- sponsors@gmail.com
  'exemple-mcard',
  'Exemple de mCard',
  'Professionnel',
  'Entreprise Demo',
  'Découvrez à quoi ressemble une mCard professionnelle avec toutes les fonctionnalités disponibles.',
  '+221 77 123 45 67',
  'contact@exemple.com',
  'premium',
  'active',
  true,
  NOW() + INTERVAL '1 year'
)
ON CONFLICT (slug) DO NOTHING;