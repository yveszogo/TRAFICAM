const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { CAUSES, GRAVITES, DUREE_VIE_MINUTES } = require('./constants');

// Distance en mètres entre deux points GPS (formule de haversine).
function distanceMetres(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function isNumberInRange(value, min, max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function validateReport(body) {
  const errors = [];
  const { latitude, longitude, lieu, cause, causeAutre, gravite } = body || {};

  if (!isNumberInRange(latitude, -90, 90)) errors.push('latitude invalide');
  if (!isNumberInRange(longitude, -180, 180)) errors.push('longitude invalide');
  if (typeof lieu !== 'string' || lieu.trim().length < 2 || lieu.length > 120) {
    errors.push('lieu obligatoire (2 à 120 caractères)');
  }
  if (!CAUSES.includes(cause)) errors.push(`cause invalide (valeurs : ${CAUSES.join(', ')})`);
  if (cause === 'autre' && (typeof causeAutre !== 'string' || causeAutre.trim().length < 2)) {
    errors.push('précisez la cause quand vous choisissez « autre »');
  }
  if (!GRAVITES.includes(gravite)) errors.push(`gravité invalide (valeurs : ${GRAVITES.join(', ')})`);

  return errors;
}

function createApp(store, { now = () => Date.now() } = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));

  function requireAuth(req, res, next) {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const user = token && store.userFromToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Connectez-vous pour signaler un embouteillage.' });
    }
    req.user = user;
    next();
  }

  function publicReport(r) {
    return {
      id: r.id,
      latitude: r.latitude,
      longitude: r.longitude,
      lieu: r.lieu,
      cause: r.cause,
      causeAutre: r.causeAutre,
      gravite: r.gravite,
      createdAt: r.createdAt,
      expiresAt: r.expiresAt,
      auteur: { id: r.userId, name: r.userName },
    };
  }

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  // Connexion simplifiée par numéro de téléphone.
  // US-04 (inscription avec code SMS et choix du profil) remplacera cette route.
  app.post('/api/auth/login', (req, res) => {
    const phone = String(req.body?.phone || '').replace(/[\s.-]/g, '');
    const name = String(req.body?.name || '').trim();
    if (!/^\+?\d{8,15}$/.test(phone)) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    }
    if (name.length < 2 || name.length > 40) {
      return res.status(400).json({ error: 'Nom obligatoire (2 à 40 caractères).' });
    }
    const user = store.findOrCreateUser(phone, name);
    const token = store.createSession(user.id);
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone } });
  });

  app.get('/api/me', requireAuth, (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, phone: req.user.phone });
  });

  // US-05 : signaler un embouteillage.
  app.post('/api/reports', requireAuth, (req, res) => {
    const errors = validateReport(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join(' ; '), details: errors });

    const created = now();
    const report = store.addReport({
      id: crypto.randomUUID(),
      userId: req.user.id,
      userName: req.user.name,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      lieu: req.body.lieu.trim(),
      cause: req.body.cause,
      causeAutre: req.body.cause === 'autre' ? req.body.causeAutre.trim() : null,
      gravite: req.body.gravite,
      createdAt: new Date(created).toISOString(),
      expiresAt: new Date(created + DUREE_VIE_MINUTES * 60 * 1000).toISOString(),
    });
    res.status(201).json(publicReport(report));
  });

  // Signalements actifs, visibles par tous (même les visiteurs non connectés).
  // Filtre optionnel par zone : ?lat=3.86&lng=11.52&rayon=5000 (mètres).
  // Filtre optionnel ?depuis=<date ISO> pour ne récupérer que les nouveaux.
  app.get('/api/reports', (req, res) => {
    const t = now();
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const rayon = Number(req.query.rayon) || 10000;
    const hasPosition = req.query.lat !== undefined && Number.isFinite(lat) && Number.isFinite(lng);
    const depuis = req.query.depuis ? Date.parse(req.query.depuis) : null;

    const reports = store
      .allReports()
      .filter((r) => Date.parse(r.expiresAt) > t)
      .filter((r) => !depuis || Date.parse(r.createdAt) > depuis)
      .map((r) => {
        const out = publicReport(r);
        if (hasPosition) out.distanceMetres = Math.round(distanceMetres(lat, lng, r.latitude, r.longitude));
        return out;
      })
      .filter((r) => !hasPosition || r.distanceMetres <= rayon)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    res.json({ reports, serverTime: new Date(t).toISOString() });
  });

  app.get('/api/reports/:id', (req, res) => {
    const report = store.allReports().find((r) => r.id === req.params.id);
    if (!report) return res.status(404).json({ error: 'Signalement introuvable.' });
    res.json({ ...publicReport(report), expire: Date.parse(report.expiresAt) <= now() });
  });

  app.get('/api/meta', (req, res) => {
    res.json({ causes: CAUSES, gravites: GRAVITES, dureeVieMinutes: DUREE_VIE_MINUTES });
  });

  return app;
}

module.exports = { createApp, distanceMetres, validateReport };
