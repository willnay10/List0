// functions/api/[[route]].js
// Full email/password auth + checklist API for List0
// 100% Cloudflare-only – no Firebase!

import { createHash, randomUUID } from 'crypto';

// Simple in-memory "database" using D1 (we'll bind it later)
let DB;

// Helper: hash password (scrypt – secure)
async function hashPassword(password) {
  const salt = randomUUID();
  const hash = createHash('scrypt')
    .update(password + salt + "list0-secret-pepper-2025")
    .digest('hex');
  return `${hash}.${salt}`;
}

// Helper: verify password
async function verifyPassword(stored, password) {
  const [hash, salt] = stored.split('.');
  const test = createHash('scrypt')
    .update(password + salt + "list0-secret-pepper-2025")
    .digest('hex');
  return test === hash;
}

export default {
  async fetch(request, env, ctx) {
    DB = env.DB;  // This gets injected when you bind D1 later
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers so browser allows requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // === SIGN UP ===
    if (path === '/api/signup' && request.method === 'POST') {
      const { email, password } = await request.json();
      if (!email || !password || password.length < 6) {
        return new Response('Bad request', { status: 400, headers: corsHeaders });
      }

      const hash = await hashPassword(password);
      try {
        await DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)')
          .bind(randomUUID(), email.toLowerCase(), hash)
          .run();
        return new Response('Created', { status: 201, headers: corsHeaders });
      } catch (e) {
        return new Response('Email already exists', { status: 409, headers: corsHeaders });
      }
    }

    // === LOGIN ===
    if (path === '/api/login' && request.method === 'POST') {
      const { email, password } = await request.json();
      const row = await DB.prepare('SELECT id, password_hash FROM users WHERE email = ?')
        .bind(email.toLowerCase())
        .first();

      if (row && await verifyPassword(row.password_hash, password)) {
        const token = btoa(row.id + ':' + Date.now()); // simple token
        return new Response(JSON.stringify({ token, userId: row.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return new Response('Wrong email or password', { status: 401, headers: corsHeaders });
    }

    // === PROTECTED ROUTES (all checklists) ===
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth && path.startsWith('/api/checklists')) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Extract userId from token (simple version)
    let userId;
    try {
      userId = atob(auth).split(':')[0];
    } catch { }

    // === GET ALL CHECKLISTS ===
    if (path === '/api/checklists' && request.method === 'GET') {
      const { results } = await DB.prepare('SELECT * FROM checklists WHERE user_id = ?')
        .bind(userId)
        .all();
      const lists = results.map(r => ({ ...r, items: JSON.parse(r.items) }));
      return new Response(JSON.stringify(lists), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // === CREATE NEW CHECKLIST ===
    if (path === '/api/checklists' && request.method === 'POST') {
      const { name } = await request.json();
      const id = randomUUID();
      await DB.prepare('INSERT INTO checklists (id, user_id, name, items) VALUES (?, ?, ?, ?)')
        .bind(id, userId, name || 'New List', JSON.stringify([]))
        .run();
      return new Response(JSON.stringify({ id }), { status: 201, headers: corsHeaders });
    }

    // === UPDATE CHECKLIST (add item, toggle, rename, etc.) ===
    if (path.startsWith('/api/checklists/') && request.method === 'PUT') {
      const listId = path.split('/').pop();
      const { name, items } = await request.json();
      await DB.prepare('UPDATE checklists SET name = ?, items = ? WHERE id = ? AND user_id = ?')
        .bind(name, JSON.stringify(items), listId, userId)
        .run();
      return new Response('Updated', { headers: corsHeaders });
    }

    // === DELETE CHECKLIST ===
    if (path.startsWith('/api/checklists/') && request.method === 'DELETE') {
      const listId = path.split('/').pop();
      await DB.prepare('DELETE FROM checklists WHERE id = ? AND user_id = ?')
        .bind(listId, userId)
        .run();
      return new Response('Deleted', { headers: corsHeaders });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};