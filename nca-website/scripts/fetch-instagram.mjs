/**
 * scripts/fetch-instagram.mjs
 *
 * Fetches recent Instagram posts via the Instagram Basic Display API
 * and writes them as news items to content/news/.
 *
 * Only runs when INSTAGRAM_TOKEN is set in the environment.
 *
 * Setup:
 *  1. Create a Facebook Developer App at https://developers.facebook.com
 *  2. Add the "Instagram Basic Display" product
 *  3. Generate a long-lived access token for the NCA Instagram account
 *  4. Set INSTAGRAM_TOKEN=<your-token> as a repository secret (GitHub) or in .env
 *
 * Token refresh:
 *  Long-lived tokens expire after 60 days. Re-run this script (or the deploy
 *  workflow) at least once a month to auto-refresh the token.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'content', 'news');

const TOKEN = process.env.INSTAGRAM_TOKEN;

if (!TOKEN) {
  // Silently skip — token not required
  process.exit(0);
}

console.log('[fetch-instagram] Fetching recent posts…');

let fetch;
try {
  ({ default: fetch } = await import('node-fetch'));
} catch {
  console.error('[fetch-instagram] node-fetch not installed. Run: npm install node-fetch');
  process.exit(1);
}

// Refresh the token (optional but recommended)
try {
  const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`;
  await fetch(refreshUrl);
  console.log('[fetch-instagram] Token refreshed.');
} catch {
  console.warn('[fetch-instagram] Token refresh failed (non-fatal).');
}

// Fetch media
const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
const mediaUrl = `https://graph.instagram.com/me/media?fields=${fields}&limit=10&access_token=${TOKEN}`;

let posts;
try {
  const res = await fetch(mediaUrl);
  const data = await res.json();
  if (!res.ok || data.error) {
    console.error('[fetch-instagram] API error:', data.error?.message ?? res.status);
    process.exit(1);
  }
  posts = data.data ?? [];
} catch (e) {
  console.error('[fetch-instagram] Network error:', e.message);
  process.exit(1);
}

console.log(`[fetch-instagram] Found ${posts.length} posts.`);
mkdirSync(OUTPUT_DIR, { recursive: true });

let created = 0;
for (const post of posts) {
  const date = post.timestamp?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
  const slug = `instagram-${post.id}`;
  const filename = join(OUTPUT_DIR, `${slug}.md`);

  if (existsSync(filename)) continue;

  const caption = (post.caption ?? '').replace(/"/g, '\\"').slice(0, 280);
  const cover = post.media_url ?? post.thumbnail_url ?? '';

  const content = `---
title: "Instagram: ${caption.slice(0, 80).replace(/\n/g, ' ')}…"
date: "${date}"
description: "${caption.replace(/\n/g, ' ').slice(0, 200)}"
cover: "${cover}"
source: "instagram"
externalUrl: "${post.permalink}"
tags: []
featured: false
---

Post do Instagram — [Ver no Instagram](${post.permalink})
`;

  writeFileSync(filename, content, 'utf-8');
  created++;
}

console.log(`[fetch-instagram] Done. Created ${created} news items.`);
