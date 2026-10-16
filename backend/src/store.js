// Stockage simple dans un fichier JSON.
// Suffisant pour le sprint 1 ; à remplacer par une vraie base (PostgreSQL, MongoDB…)
// sans changer les routes : seules les fonctions de ce fichier sont à réécrire.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function createStore(filePath) {
  let data = { users: [], sessions: [], reports: [] };

  if (filePath && fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  function save() {
    if (!filePath) return;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  return {
    findOrCreateUser(phone, name) {
      let user = data.users.find((u) => u.phone === phone);
      if (!user) {
        user = { id: crypto.randomUUID(), phone, name, createdAt: new Date().toISOString() };
        data.users.push(user);
      } else if (name && user.name !== name) {
        user.name = name;
      }
      save();
      return user;
    },

    createSession(userId) {
      const token = crypto.randomBytes(24).toString('hex');
      data.sessions.push({ token, userId, createdAt: new Date().toISOString() });
      save();
      return token;
    },

    userFromToken(token) {
      const session = data.sessions.find((s) => s.token === token);
      if (!session) return null;
      return data.users.find((u) => u.id === session.userId) || null;
    },

    addReport(report) {
      data.reports.push(report);
      save();
      return report;
    },

    // Les signalements expirés restent en base (US-06) : on filtre seulement à la lecture.
    allReports() {
      return data.reports;
    },
  };
}

module.exports = { createStore };
