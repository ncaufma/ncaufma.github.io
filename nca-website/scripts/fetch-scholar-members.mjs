/**
 * scripts/fetch-scholar-members.mjs
 *
 * Iterates over every team member file in src/content/team/ that has a
 * `googleScholar:` URL, fetches their personal publication list from Google
 * Scholar, and writes it to src/data/member-publications/{slug}.json.
 *
 * The team-member page (src/pages/team/[slug].astro) loads the corresponding
 * JSON at build time and renders the list below the Highlights section.
 *
 * Usage:
 *   npm run update:scholar:members
 *
 * Optional flags:
 *   --dry-run  : report what would change but do not write files
 *   --only SLUG: only process the given member slug (useful for debugging)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetchScholarPublications } from './lib/scholar-fetch.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const TEAM_DIR   = join(ROOT, 'src', 'content', 'team');
const OUTPUT_DIR = join(ROOT, 'src', 'data', 'member-publications');

const DRY_RUN = process.argv.includes('--dry-run');
const onlyIdx = process.argv.indexOf('--only');
const ONLY    = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;

if (DRY_RUN) console.log('[members-scholar] Dry-run ON (no files will be written).');
if (ONLY)    console.log(`[members-scholar] Limiting to slug: ${ONLY}`);

// ── Parse frontmatter: minimal YAML reader for our schema ────────
//
// We only need two fields (name, googleScholar). A full YAML parser
// would be overkill and would pull in a new dependency.
function readFrontmatter(filepath) {
  const raw = readFileSync(filepath, 'utf-8');
  // Accept the standard `---...---` block. If the closing fence is missing
  // (some legacy files are malformed), scan the whole file line by line.
  let block;
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (m) {
    block = m[1];
  } else if (raw.startsWith('---')) {
    block = raw.replace(/^---\s*\n/, '');
  } else {
    return {};
  }
  const out = {};
  const lines = block.split('\n');
  for (const line of lines) {
    const mm = line.match(/^(\w+)\s*:\s*(.*)$/);
    if (!mm) continue;
    let val = mm[2].trim();
    // Strip surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[mm[1]] = val;
  }
  return out;
}

function isPlaceholder(value) {
  return !value || value.startsWith('[REQUIRED');
}

// ── Enumerate team members with a Scholar URL ────────────────────
if (!existsSync(TEAM_DIR)) {
  console.error(`[members-scholar] Team dir not found: ${TEAM_DIR}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(TEAM_DIR).filter(f => f.endsWith('.md'));
const targets = [];

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  if (ONLY && slug !== ONLY) continue;

  const fm = readFrontmatter(join(TEAM_DIR, file));
  if (isPlaceholder(fm.googleScholar)) continue;

  // Only accept real Scholar author URLs. Anything else is ignored.
  if (!/scholar\.google\.[^/]+\/citations\?/.test(fm.googleScholar)) {
    console.warn(`[members-scholar] ${slug}: googleScholar is not a Scholar citations URL, skipping`);
    continue;
  }

  targets.push({ slug, name: fm.name || slug, url: fm.googleScholar });
}

console.log(`[members-scholar] ${targets.length} member(s) with a Scholar URL.`);

if (targets.length === 0) {
  console.log('[members-scholar] Nothing to do.');
  process.exit(0);
}

// ── Fetch each member ────────────────────────────────────────────
let ok = 0, fail = 0;

for (const { slug, name, url } of targets) {
  console.log(`\n[members-scholar] ${name} (${slug})`);
  console.log(`  ${url}`);

  let pubs;
  try {
    pubs = await fetchScholarPublications(url, {
      log: (msg) => console.log(`  ${msg}`),
    });
  } catch (e) {
    console.error(`  ERROR: ${e.message}`);
    fail++;
    continue;
  }

  const outFile = join(OUTPUT_DIR, `${slug}.json`);

  // Keep a previously-fetched cache when the current run returns nothing.
  // This happens on network errors or when Scholar serves a CAPTCHA; we do
  // not want to wipe good data with an empty list.
  if (pubs.length === 0) {
    if (existsSync(outFile)) {
      console.warn(`  WARNING: got 0 publications; keeping existing cache at ${outFile}`);
    } else {
      console.warn(`  WARNING: got 0 publications and no cache exists; nothing written.`);
    }
    fail++;
    continue;
  }

  // Sort newest first, consistent with main publications page
  pubs.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  const payload = {
    slug,
    name,
    sourceUrl: url,
    fetchedAt: new Date().toISOString(),
    count: pubs.length,
    publications: pubs,
  };

  if (DRY_RUN) {
    console.log(`  [dry-run] would write ${pubs.length} publication(s) to ${outFile}`);
  } else {
    writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
    console.log(`  wrote ${pubs.length} publication(s) to ${outFile}`);
  }

  ok++;
}

console.log(`\n[members-scholar] Done. Success: ${ok}, Failed: ${fail}.`);
