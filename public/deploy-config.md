# Configuration de déploiement pour finderid.info

## Fichiers créés pour le routage SPA

### Pour Netlify
- `_redirects` : Gère les redirections pour les routes SPA
- Toutes les routes `/mcard/*` et `/m/*` sont redirigées vers `index.html`

### Pour Apache
- `.htaccess` : Configuration pour serveurs Apache
- Inclut la réécriture d'URL et la mise en cache

### Pour Vercel
- `vercel.json` : Configuration pour Vercel
- Gère les rewrites pour les routes SPA

## Routes configurées

1. **Routes de cartes MCard :**
   - `/mcard/:slug` → Affichage de carte avec slug
   - `/m/:slug` → Alias pour `/mcard/:slug`

2. **Routes de l'application :**
   - `/mcards` → Liste des cartes
   - `/profile` → Profil utilisateur
   - `/admin/*` → Panel d'administration
   - `/search` → Recherche
   - `/messages` → Messages
   - `/notifications` → Notifications
   - Etc.

## Configuration DNS

Assurez-vous que :
1. Le domaine `finderid.info` pointe vers le serveur correct
2. Le certificat SSL est configuré
3. Les redirections HTTP → HTTPS sont actives

## Test des liens

Les liens de cartes utilisent maintenant systématiquement :
- `https://www.finderid.info/mcard/slug-de-la-carte`

## Edge Functions

Une fonction edge `increment-view` a été créée pour gérer l'incrémentation des vues de façon plus fiable.