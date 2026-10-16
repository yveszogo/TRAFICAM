// Adresse de l'API (dossier backend/).
// Sur un vrai téléphone, "localhost" désigne le téléphone lui-même : mettez l'adresse IP
// de l'ordinateur qui lance l'API, par exemple dans un fichier mobile/.env :
//   EXPO_PUBLIC_API_URL=http://192.168.1.20:3000
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Fréquence de rafraîchissement des signalements des autres usagers.
export const REFRESH_INTERVAL_MS = 15000;
