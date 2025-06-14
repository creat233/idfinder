
-- Autoriser la valeur 'recovery_requested' dans le champ status de la table reported_cards
-- Supposons que status soit un CHECK ENUM ou une contrainte similaire

-- 1. Supprimer la contrainte CHECK existante sur le champ status (si elle existe)
ALTER TABLE public.reported_cards
DROP CONSTRAINT IF EXISTS reported_cards_status_check;

-- 2. Ajouter une nouvelle contrainte CHECK incluant 'recovery_requested'
ALTER TABLE public.reported_cards
ADD CONSTRAINT reported_cards_status_check
CHECK (
  status IN (
    'pending',
    'found',
    'recovered',
    'lost',
    'public_contact',
    'canceled',
    'recovery_requested' -- <- On ajoute cette valeur
  )
);

-- À noter : adaptez la liste ci-dessus si d'autres statuts existent dans votre système.
