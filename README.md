<<<<<<< HEAD
# Traficam

Application mobile de signalement d'embouteillages (Cameroun), développée en Scrum (sprints de 2 semaines).

## Partie livrée : signaler un embouteillage (Sprint 1, US-05 + US-06)

Un utilisateur **connecté** ouvre l'onglet **Signaler** dans la barre du bas, puis indique :

1. **Le lieu** : la position GPS est remplie automatiquement, et le nom du lieu (ex. « Carrefour Warda ») est proposé puis modifiable.
2. **La cause** : accident, travaux, marché, pluie / inondation, véhicule en panne, contrôle de police, route barrée, heure de pointe, ou autre (champ libre).
3. **La gravité** : « Ça circule un peu » (orange) ou « Ça ne circule pas du tout » (rouge).

Le signalement est enregistré sur le serveur. **Tous les autres usagers** le voient dans l'onglet **Trafic** (rafraîchi toutes les 15 s), avec une alerte « Nouvel embouteillage : … ». Le signalement disparaît de la liste au bout de **45 minutes** (US-06), mais il reste enregistré en base.

Un visiteur non connecté ne peut pas signaler : l'API répond 401.

## Structure

```
backend/   API Node.js + Express (stockage dans un fichier JSON pour le moment)
mobile/    Application Expo (React Native) — Android, iOS et web
```

## Lancer le projet

Il faut **Node.js 18+**, et l'application **Expo Go** sur le téléphone.

### 1. L'API

```bash
cd backend
npm install
npm start          # http://localhost:3000
npm test           # 7 tests automatiques
```

### 2. L'application mobile

```bash
cd mobile
npm install
cp .env.example .env     # puis remplacez l'IP par celle de votre ordinateur
npx expo start           # scannez le QR code avec Expo Go
```

> Sur un téléphone, `localhost` désigne le téléphone lui-même. Mettez donc dans `mobile/.env` l'adresse IP de l'ordinateur qui fait tourner l'API (`ipconfig` sous Windows, `ifconfig` sous Mac/Linux). Le téléphone et l'ordinateur doivent être sur le même Wi-Fi.
> Pour tester dans le navigateur : `npx expo start --web`.

## API

| Méthode | Route | Auth | Rôle |
|---|---|---|---|
| POST | `/api/auth/login` | — | Connexion simplifiée `{ phone, name }` → `{ token, user }` |
| GET | `/api/me` | Bearer | Utilisateur connecté |
| POST | `/api/reports` | Bearer | Créer un signalement `{ latitude, longitude, lieu, cause, causeAutre?, gravite }` |
| GET | `/api/reports` | — | Signalements actifs. Filtres : `?lat=&lng=&rayon=` (mètres), `?depuis=<date ISO>` |
| GET | `/api/reports/:id` | — | Détail (y compris expiré) |
| GET | `/api/meta` | — | Listes des causes et gravités, durée de vie |

Valeurs acceptées :
- `cause` : `accident`, `travaux`, `marche`, `pluie_inondation`, `panne`, `controle_police`, `route_barree`, `heure_de_pointe`, `autre`
- `gravite` : `un_peu_fluide`, `bloque`

Variables d'environnement : `PORT` (3000), `DATA_FILE` (`backend/data/db.json`), `DUREE_VIE_MINUTES` (45).

## Pour les autres membres de l'équipe

- **Connexion (US-04)** : `POST /api/auth/login` est une connexion simplifiée pour pouvoir tester. L'inscription avec code SMS et choix du profil la remplacera. Côté mobile, tout passe par `mobile/src/session.js`.
- **Carte (US-03)** : le hook `useReports()` (`mobile/src/useReports.js`) fournit déjà la liste des signalements actifs avec leurs coordonnées et leur couleur (`gravite(...).color`).
- **Nouveaux onglets** : ajoutez-les dans le tableau `TABS` de `mobile/App.js`.
- **Base de données** : il suffit de réécrire `backend/src/store.js`, sans toucher aux routes.
- **Design** : l'interface suit Material Design 3 (police Inter, icônes Material). Les couleurs, la typographie et les espacements sont définis dans `mobile/src/theme.js`. Réutilisez les composants de `mobile/src/components/` (`AppText`, `Button`, `TextField`, `Chip`, `Icon`) pour garder une interface cohérente.
-
- <img width="390" height="844" alt="image" src="https://github.com/user-attachments/assets/32fbb1cb-8003-440e-9514-b58cf2250f13" />
<img width="390" height="844" alt="image" src="https://github.com/user-attachments/assets/c186e117-b3e9-4757-8905-bb209b6379b3" />
<img width="390" height="844" alt="image" src="https://github.com/user-attachments/assets/80fec7a4-6327-4a84-9bab-c7f71e62c05c" />




=======
# TRAFICAM
Application mobile de consultation de l'état du trafic. M2/G6
>>>>>>> e37a3d3edd822600b4e331e6c8ff57bc53db6247
