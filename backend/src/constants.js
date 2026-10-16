// Valeurs partagées avec l'application mobile (voir mobile/src/constants.js).

// Causes possibles d'un embouteillage (US-07 : liste prédéfinie + "autre" en champ libre).
const CAUSES = [
  'accident',
  'travaux',
  'marche',
  'pluie_inondation',
  'panne',
  'controle_police',
  'route_barree',
  'heure_de_pointe',
  'autre',
];

// Gravité : "un peu fluide" (ça circule un peu) ou "bloque" (ça ne circule pas du tout).
const GRAVITES = ['un_peu_fluide', 'bloque'];

// US-06 : un signalement disparaît de la carte après ce délai s'il n'est pas confirmé.
const DUREE_VIE_MINUTES = Number(process.env.DUREE_VIE_MINUTES) || 45;

module.exports = { CAUSES, GRAVITES, DUREE_VIE_MINUTES };
