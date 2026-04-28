/**
 * scripts/fetch-scholar.mjs
 *
 * Fetches publications from a Google Scholar group/author profile page
 * and writes each publication as a Markdown file to content/publications/.
 *
 * Usage:
 *   npm run update:scholar
 *
 * Configuration:
 *   Set SCHOLAR_URL in your environment or in .env:
 *     SCHOLAR_URL=https://scholar.google.com/citations?user=XXXXXXX&sortby=pubdate
 *
 * Requirements:
 *   npm install node-fetch cheerio
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { classifyVenue } from './classify-venue.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'src', 'content', 'publications');

// ── CLI flags ─────────────────────────────────────────────────
// --sync     : also DELETE files that no longer appear in Scholar
// --dry-run  : report what would change but do not write/delete anything
const SYNC    = process.argv.includes('--sync');
const DRY_RUN = process.argv.includes('--dry-run');

if (SYNC)    console.log('[fetch-scholar] Sync mode ON (stale imports will be removed).');
if (DRY_RUN) console.log('[fetch-scholar] Dry-run ON (no files will be written or deleted).');

// ── Load scholar URL ──────────────────────────────────────────
let scholarUrl = process.env.SCHOLAR_URL;

if (!scholarUrl) {
  // Try to read from content/settings/site.yaml
  const settingsPath = join(ROOT, 'content', 'settings', 'site.yaml');
  if (existsSync(settingsPath)) {
    const yaml = readFileSync(settingsPath, 'utf-8');
    const match = yaml.match(/googleScholarGroupUrl:\s*["']?([^"'\n\[]+)["']?/);
    if (match && !match[1].startsWith('[REQUIRED')) {
      scholarUrl = match[1].trim();
    }
  }
}

if (!scholarUrl || scholarUrl.startsWith('[REQUIRED')) {
  console.warn('[fetch-scholar] No SCHOLAR_URL set. Skipping publication import.');
  console.warn('  Set SCHOLAR_URL env var or fill googleScholarGroupUrl in content/settings/site.yaml');
  process.exit(0);
}

console.log(`[fetch-scholar] Fetching publications from:\n  ${scholarUrl}`);

// ── Dynamic imports ───────────────────────────────────────────
let fetch, cheerio;
try {
  ({ default: fetch } = await import('node-fetch'));
  cheerio = await import('cheerio');
} catch (e) {
  console.error('[fetch-scholar] Missing dependencies. Run: npm install node-fetch cheerio');
  process.exit(1);
}

const { load } = cheerio;

// ── Paginated fetch from Scholar ──────────────────────────────
//
// Google Scholar paginates author pages by `cstart` (offset) and `pagesize`
// (max 100). We loop in batches of 100 until no more rows are returned.

const PAGE_SIZE = 100;
const MAX_PAGES = 20;          // safety cap (up to 2000 publications)
const DELAY_MS  = 1500;        // polite delay between requests

function buildPagedUrl(baseUrl, cstart, pagesize) {
  const u = new URL(baseUrl);
  u.searchParams.set('cstart', String(cstart));
  u.searchParams.set('pagesize', String(pagesize));
  return u.toString();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const publications = [];

for (let page = 0; page < MAX_PAGES; page++) {
  const cstart  = page * PAGE_SIZE;
  const pageUrl = buildPagedUrl(scholarUrl, cstart, PAGE_SIZE);

  console.log(`[fetch-scholar] Fetching page ${page + 1} (cstart=${cstart})...`);

  let html;
  try {
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NCA-UFMA-Bot/1.0; +https://ncaufma.github.io)',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) {
      console.error(`[fetch-scholar] HTTP ${res.status} fetching Scholar page.`);
      break;
    }
    html = await res.text();
  } catch (e) {
    console.error('[fetch-scholar] Network error:', e.message);
    break;
  }

  const $ = load(html);
  const rows = $('.gsc_a_tr');

  if (rows.length === 0) {
    console.log(`[fetch-scholar] No more rows on page ${page + 1}. Stopping.`);
    break;
  }

  let addedThisPage = 0;

  rows.each((_, row) => {
    const titleEl = $(row).find('.gsc_a_at');
    const title   = titleEl.text().trim();
    const link    = titleEl.attr('href');
    const authors = $(row).find('.gs_gray').first().text().trim();
    const venue   = $(row).find('.gs_gray').last().text().trim();
    const year    = parseInt($(row).find('.gsc_a_y span').text().trim(), 10) || undefined;

    if (!title) return;

    const type = classifyVenue(venue);

    publications.push({ title, authors, venue, year, type, link });
    addedThisPage++;
  });

  console.log(`[fetch-scholar]   +${addedThisPage} (total: ${publications.length})`);

  // Stop when the page returned fewer than PAGE_SIZE rows: it was the last page.
  if (rows.length < PAGE_SIZE) {
    break;
  }

  // Be polite between requests to reduce CAPTCHA risk
  await sleep(DELAY_MS);
}

console.log(`[fetch-scholar] Parsed ${publications.length} publications total.`);

if (publications.length === 0) {
  console.warn('[fetch-scholar] No publications found. Scholar may have returned a captcha or the HTML structure changed.');
  process.exit(0);
}

// ── Slug helper (must match for both write AND sync phases) ───
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// ── Write Markdown files ──────────────────────────────────────
mkdirSync(OUTPUT_DIR, { recursive: true });
let created = 0;
let skipped = 0;

// Collect the set of slugs currently present in Scholar
// (used later by the --sync phase to detect stale files).
const currentSlugs = new Set();

for (const pub of publications) {
  const slug = titleToSlug(pub.title);
  currentSlugs.add(slug);

  const filename = join(OUTPUT_DIR, `${slug}.md`);

  // Skip if already exists
  if (existsSync(filename)) { skipped++; continue; }

  const authorsList = pub.authors
    ? pub.authors.split(',').map(a => `  - "${a.trim()}"`).join('\n')
    : '';

  const content = `---
title: "${pub.title.replace(/"/g, '\\"')}"
authors:
${authorsList || '  - "[REQUIRED: fill authors]"'}
venue: "${(pub.venue || '').replace(/"/g, '\\"')}"
year: ${pub.year ?? 'null'}
doi: ""
url: "${pub.link ? `https://scholar.google.com${pub.link}` : ''}"
type: "${pub.type}"
researchArea: ""
abstract: ""
tags: []
featured: false
scholarId: "${slug}"
---
`;

  if (DRY_RUN) {
    console.log(`[dry-run] would create: ${slug}.md`);
  } else {
    writeFileSync(filename, content, 'utf-8');
  }
  created++;
}

console.log(`[fetch-scholar] Created: ${created}, Skipped (already exist): ${skipped}`);

// ── Sync phase: remove stale imports ──────────────────────────
//
// A file is considered a "managed Scholar import" when its
// `scholarId:` field equals the filename's base (which is how
// this script labels new imports). Manually-added files should
// have a different scholarId (or an empty one) so they are kept.
if (SYNC) {
  console.log('[fetch-scholar] Checking for stale Scholar imports...');
  const existingFiles = readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.md'));
  let removed = 0;
  let preserved = 0;

  for (const file of existingFiles) {
    const stem = file.replace(/\.md$/, '');
    const raw  = readFileSync(join(OUTPUT_DIR, file), 'utf-8');
    const m    = raw.match(/^scholarId:\s*"([^"]*)"/m);
    const sid  = m ? m[1] : '';

    // Managed import: scholarId matches filename stem
    const isManaged = sid && sid === stem;

    if (!isManaged) { preserved++; continue; }

    if (!currentSlugs.has(sid)) {
      if (DRY_RUN) {
        console.log(`[dry-run] would delete: ${file}`);
      } else {
        unlinkSync(join(OUTPUT_DIR, file));
      }
      removed++;
    }
  }

  console.log(`[fetch-scholar] Sync: removed ${removed} stale file(s), preserved ${preserved} manual file(s).`);
}

console.log('[fetch-scholar] Done.');
