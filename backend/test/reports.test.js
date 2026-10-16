const test = require('node:test');
const assert = require('node:assert');
const { createApp, distanceMetres } = require('../src/app');
const { createStore } = require('../src/store');

// Démarre l'API sur un port libre avec une horloge contrôlable.
async function startServer() {
  const clock = { t: Date.parse('2026-10-15T08:00:00Z') };
  const app = createApp(createStore(null), { now: () => clock.t });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, url, body, token) => {
    const res = await fetch(base + url, {
      method,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: res.status, body: await res.json() };
  };
  return { clock, call, close: () => server.close() };
}

async function login(call, phone = '+237690000001', name = 'Jacinta') {
  const res = await call('POST', '/api/auth/login', { phone, name });
  assert.strictEqual(res.status, 200);
  return res.body.token;
}

const signalement = {
  latitude: 3.8667,
  longitude: 11.5167,
  lieu: 'Carrefour Warda',
  cause: 'accident',
  gravite: 'bloque',
};

test('un visiteur non connecté ne peut pas signaler', async () => {
  const s = await startServer();
  const res = await s.call('POST', '/api/reports', signalement);
  assert.strictEqual(res.status, 401);
  s.close();
});

test('un utilisateur connecté signale et les autres usagers le voient', async () => {
  const s = await startServer();
  const tokenA = await login(s.call, '+237690000001', 'Jacinta');
  const tokenB = await login(s.call, '+237690000002', 'Paul');

  const created = await s.call('POST', '/api/reports', signalement, tokenA);
  assert.strictEqual(created.status, 201);
  assert.strictEqual(created.body.lieu, 'Carrefour Warda');
  assert.strictEqual(created.body.auteur.name, 'Jacinta');

  // Paul (connecté) et un visiteur (non connecté) voient le signalement.
  for (const token of [tokenB, undefined]) {
    const list = await s.call('GET', '/api/reports', null, token);
    assert.strictEqual(list.status, 200);
    assert.strictEqual(list.body.reports.length, 1);
    assert.strictEqual(list.body.reports[0].id, created.body.id);
  }
  s.close();
});

test('les champs lieu, cause et gravité sont validés', async () => {
  const s = await startServer();
  const token = await login(s.call);

  const sansLieu = await s.call('POST', '/api/reports', { ...signalement, lieu: '' }, token);
  assert.strictEqual(sansLieu.status, 400);

  const mauvaiseCause = await s.call('POST', '/api/reports', { ...signalement, cause: 'xyz' }, token);
  assert.strictEqual(mauvaiseCause.status, 400);

  const mauvaiseGravite = await s.call('POST', '/api/reports', { ...signalement, gravite: 'moyen' }, token);
  assert.strictEqual(mauvaiseGravite.status, 400);

  const autreSansPrecision = await s.call('POST', '/api/reports', { ...signalement, cause: 'autre' }, token);
  assert.strictEqual(autreSansPrecision.status, 400);

  const autre = await s.call(
    'POST',
    '/api/reports',
    { ...signalement, cause: 'autre', causeAutre: 'Cortège officiel' },
    token,
  );
  assert.strictEqual(autre.status, 201);
  assert.strictEqual(autre.body.causeAutre, 'Cortège officiel');
  s.close();
});

test('un signalement expire après 45 minutes mais reste en base', async () => {
  const s = await startServer();
  const token = await login(s.call);
  const created = await s.call('POST', '/api/reports', signalement, token);

  s.clock.t += 44 * 60 * 1000;
  assert.strictEqual((await s.call('GET', '/api/reports')).body.reports.length, 1);

  s.clock.t += 2 * 60 * 1000;
  assert.strictEqual((await s.call('GET', '/api/reports')).body.reports.length, 0);

  const detail = await s.call('GET', `/api/reports/${created.body.id}`);
  assert.strictEqual(detail.status, 200);
  assert.strictEqual(detail.body.expire, true);
  s.close();
});

test('filtre par zone et par date pour ne récupérer que les nouveaux', async () => {
  const s = await startServer();
  const token = await login(s.call);
  await s.call('POST', '/api/reports', signalement, token); // Yaoundé
  s.clock.t += 60 * 1000;
  const douala = await s.call(
    'POST',
    '/api/reports',
    { ...signalement, latitude: 4.0511, longitude: 9.7679, lieu: 'Rond-point Deïdo' },
    token,
  );

  const proches = await s.call('GET', '/api/reports?lat=3.87&lng=11.52&rayon=5000');
  assert.deepStrictEqual(proches.body.reports.map((r) => r.lieu), ['Carrefour Warda']);
  assert.ok(proches.body.reports[0].distanceMetres < 1000);

  const depuis = new Date(s.clock.t - 30 * 1000).toISOString();
  const nouveaux = await s.call('GET', `/api/reports?depuis=${encodeURIComponent(depuis)}`);
  assert.deepStrictEqual(nouveaux.body.reports.map((r) => r.id), [douala.body.id]);
  s.close();
});

test('connexion refusée si le numéro est invalide', async () => {
  const s = await startServer();
  const res = await s.call('POST', '/api/auth/login', { phone: 'abc', name: 'Jacinta' });
  assert.strictEqual(res.status, 400);
  s.close();
});

test('distanceMetres : Yaoundé – Douala ≈ 200 km', () => {
  const d = distanceMetres(3.8667, 11.5167, 4.0511, 9.7679);
  assert.ok(d > 190000 && d < 210000, `distance = ${d}`);
});
