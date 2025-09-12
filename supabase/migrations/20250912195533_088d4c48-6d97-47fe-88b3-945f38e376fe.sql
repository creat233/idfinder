-- Désactiver temporairement le trigger qui cause l'erreur
DROP TRIGGER IF EXISTS notify_favorites_on_product_added ON mcard_products;

-- Insérer les produits épinglés pour les catalogues
INSERT INTO mcard_products (
  mcard_id,
  name,
  description,
  price,
  currency,
  category,
  image_url,
  is_active,
  is_pinned,
  created_at,
  updated_at
) VALUES 
-- Produits pour Big restaurant
(
  'ead16251-18d8-4a10-bf69-69879a8e3b9b',
  'Burger Royal',
  'Double steak haché, fromage cheddar, salade, tomates, cornichons, sauce maison. Servi avec frites maison.',
  2000,
  'FCFA',
  'Plat',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
  true,
  true,
  now(),
  now()
),
(
  'ead16251-18d8-4a10-bf69-69879a8e3b9b',
  'Pizza Margherita',
  'Pâte artisanale, sauce tomate, mozzarella di bufala, basilic frais, huile d''olive.',
  1800,
  'FCFA',
  'Plat',
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop',
  true,
  true,
  now(),
  now()
),
(
  'ead16251-18d8-4a10-bf69-69879a8e3b9b',
  'Salade César',
  'Salade romaine, poulet grillé, croutons maison, parmesan, sauce césar.',
  1500,
  'FCFA',
  'Entrée',
  'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop',
  true,
  true,
  now(),
  now()
),
-- Produits pour Momo Design
(
  '46d8aa36-8d2b-443d-b2fe-5b9966bdd351',
  'Design Logo Professionnel',
  'Création de logo unique pour votre entreprise. Inclut 3 concepts, révisions illimitées et fichiers vectoriels.',
  25000,
  'FCFA',
  'Service',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=400&fit=crop',
  true,
  true,
  now(),
  now()
),
(
  '46d8aa36-8d2b-443d-b2fe-5b9966bdd351',
  'Site Web Vitrine',
  'Site web responsive et moderne pour présenter votre activité. Design personnalisé et optimisé SEO.',
  75000,
  'FCFA',
  'Service',
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=400&fit=crop',
  true,
  true,
  now(),
  now()
),
(
  '46d8aa36-8d2b-443d-b2fe-5b9966bdd351',
  'Carte de Visite Design',
  'Design de carte de visite élégant et professionnel. Impression haute qualité incluse.',
  5000,
  'FCFA',
  'Produit',
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=400&fit=crop',
  true,
  true,
  now(),
  now()
);