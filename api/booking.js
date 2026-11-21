/**
 * ETHIO H — booking endpoint
 * ---------------------------------------------------------------
 * Runtime: Node 18+ (no dependencies) · designed for Vercel
 * Accepts POST application/json from contact.html
 *
 * Behaviour, in order:
 *   1. Validate the payload.
 *   2. If Supabase env vars are present, insert into `booking_requests`
 *      and (optionally) create a calendar hold via Google Calendar.
 *   3. Always respond 200 with { ok:true, reference }.
 *
 * Env vars (Vercel → Project → Settings → Environment Variables):
 *   SUPABASE_URL              https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY service-role key (server only)
 *   GCAL_ACCESS_TOKEN         optional: OAuth access token with calendar.events scope
 *   GCAL_CALENDAR_ID          optional: e.g. "primary"
 */

const AREAS = ['Bole','Old Airport','CMC','Kazanchis','Sarbet','Ring-road corridor','OutsideAddis'];

function clean(v, max = 500) {
  return String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

function isEmail(v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }

function reference() {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EH-${y}${m}-${rnd}`;
}

async function supabaseInsert(row, env) {
  const url = `${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/booking_requests`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(row)
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
}

async function calendarHold(row, env) {
  if (!env.GCAL_ACCESS_TOKEN || !env.GCAL_CALENDAR_ID) return;
  if (!row.preferred_date) return;
  // All-day hold on the preferred date; title follows the house voice.
  const body = {
    summary: `Hold · ${row.service || 'Residence care'} — ${row.name}`,
    description: [
      `Reference ${row.reference}`,
      `Phone ${row.phone}`,
      `Email ${row.email}`,
      `Area ${row.neighbourhood}`,
      `Residence ${row.residence}`,
      row.notes ? `Notes: ${row.notes}` : ''
    ].filter(Boolean).join('\n'),
    start: { date: row.preferred_date },
    end: { date: row.preferred_date }
  };
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GCAL_CALENDAR_ID)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GCAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );
  if (!res.ok) throw new Error(`Calendar ${res.status}`);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ ok: false, error: 'Invalid JSON' }); }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Empty body' });
  }

  const row = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    neighbourhood: clean(body.neighbourhood, 60),
    residence: clean(body.residence, 80),
    service: clean(body.service, 80),
    preferred_date: clean(body.preferred_date, 10) || null,
    preferred_time: clean(body.preferred_time, 40) || null,
    notes: clean(body.notes, 1200) || null,
    source: clean(body.source, 80) || 'website',
    reference: clean(body.reference, 24) || reference(),
    submitted_at: new Date().toISOString()
  };

  const errors = [];
  if (!row.name) errors.push('name');
  if (!row.phone) errors.push('phone');
  if (!row.email || !isEmail(row.email)) errors.push('email');
  if (!row.neighbourhood) errors.push('neighbourhood');
  if (!row.service) errors.push('service');
  if (errors.length) return res.status(422).json({ ok: false, error: 'Missing or invalid fields', fields: errors });

  const env = process.env;
  let stored = 'none';

  try {
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabaseInsert(row, env);
      stored = 'supabase';
    }
  } catch (e) {
    console.error('[booking] supabase failed:', e.message);
    stored = 'none';
  }

  try {
    await calendarHold(row, env);
  } catch (e) {
    console.error('[booking] calendar failed:', e.message);
  }

  return res.status(200).json({ ok: true, reference: row.reference, stored });
};
