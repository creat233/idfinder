# Plan d'implémentation

## 1. Agent IA multilingue
**Fichier** : `supabase/functions/ai-auto-reply/index.ts`
- Détecter la langue du message entrant via Lovable AI (petit appel préliminaire ou instruction système).
- Modifier le prompt système pour instruire l'IA : « Réponds dans la MÊME langue que le message du client. Si le client écrit en anglais, réponds en anglais. En wolof, réponds en wolof. Etc. »
- Les produits/services/statuts restent dans leur langue d'origine dans la base de connaissances ; l'IA les traduira à la volée si nécessaire.

## 2. Traduction des messages (bouton sous chaque bulle)
**Nouveau composant** : `src/components/messages/MessageTranslateButton.tsx`
- Petit bouton « 🌐 Traduire » sous chaque bulle de message (envoyée et reçue).
- Au clic → appelle une nouvelle Edge Function `translate-message` qui utilise Lovable AI (`google/gemini-3-flash-preview`) pour traduire vers la langue courante de l'utilisateur (`useTranslation().language`).
- Affiche la traduction en dessous du texte original avec un lien « Voir l'original ».
- Cache local (useState) pour éviter les re-traductions.

**Nouvelle Edge Function** : `supabase/functions/translate-message/index.ts`
- Input : `{ text, targetLang }` → Output : `{ translation }`.

**Intégration** : `src/components/messages/MessageBubble.tsx` (ou équivalent) — ajouter le bouton.

## 3. Retrait Google AdSense
**Fichiers** :
- `src/components/ads/PublicAdsDisplay.tsx` — supprimer le bloc AdSense, ne garder que les pubs internes admin (ou vider complètement).
- `index.html` — retirer le script `adsbygoogle.js` s'il existe.
- Recherche `ca-pub-2470909766437244` et `adsbygoogle` pour nettoyer.

## 4. Langues étendues
**Fichiers** : `src/utils/translations/languages.ts` + `src/utils/translations/types.ts`
- Ajouter : Español 🇪🇸, Português 🇵🇹, العربية 🇸🇦, Wolof 🇸🇳, Deutsch 🇩🇪, Italiano 🇮🇹, 中文 🇨🇳, Русский 🇷🇺.
- Étendre `Language` type.
- Pour les nouvelles langues, les clés manquantes retomberont sur le français (fallback dans `TranslationProvider`).
- Ajouter une note : la traduction complète des menus arrivera progressivement, mais l'agent IA et les messages fonctionnent immédiatement dans ces langues.

## 5. Avatars cliquables dans les messages
**Fichiers** :
- `src/components/messages/ConversationView.tsx` (ou header de conversation) — afficher `mcard.profile_picture_url` au lieu de l'initiale gradient.
- Wrapper l'avatar dans un `<Link to={/mcard/${mcardSlug}}>` pour naviguer vers la MCard.
- Idem pour la liste des conversations : avatar cliquable.

## 6. MCard pleine largeur sur web
**Fichier** : `src/pages/MCardView.tsx`
- Retirer `max-w-4xl mx-auto` sur desktop.
- Utiliser `w-full` avec padding responsive : `px-2 sm:px-4 lg:px-8` mais sans contrainte de largeur max sur `md+`.
- Vérifier `MCardCustomized` pour qu'il s'étende aussi.

## 7. RGPD inscription
**Fichier** : `src/features/auth/components/RegisterForm.tsx`
- Ajouter un `<Checkbox>` obligatoire avant le bouton « S'inscrire ».
- Label : « J'ai lu et j'accepte la [Politique de confidentialité](/privacy-policy) et les [Conditions d'utilisation] de Finder ID ».
- Le bouton « S'inscrire » est désactivé (`disabled`) tant que la case n'est pas cochée.
- Le lien ouvre `/privacy-policy` dans un nouvel onglet.

---

## Ordre d'exécution
1. Edge functions (translate-message + update ai-auto-reply)
2. Retrait AdSense
3. Ajout langues
4. RGPD checkbox
5. Avatars cliquables + bouton traduction messages
6. MCard pleine largeur

Je lance dès validation.