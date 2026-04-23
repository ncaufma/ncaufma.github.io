/**
 * scripts/reclassify-pubs.mjs
 *
 * Walks every .md file in src/content/publications/ and updates its
 * `type:` frontmatter field using the shared classifier in classify-venue.mjs.
 *
 * Usage:
 *   node scripts/reclassify-pubs.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { classifyVenue } from './classify-venue.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB_DIR   = join(__dirname, '..', 'src', 'content', 'publications');

const files = readdirSync(PUB_DIR).filter(f => f.endsWith('.md'));
console.log(`[reclassify] Scanning ${files.length} files in ${PUB_DIR}`);

let changed  = 0;
let kept     = 0;
const counts = { journal: 0, conference: 0, 'book-chapter': 0, thesis: 0, other: 0 };

for (const file of files) {
  const path = join(PUB_DIR, file);
  const raw  = readFileSync(path, 'utf-8');

  // Only process files that look like frontmatter docs
  if (!raw.startsWith('---')) continue;

  const venueMatch = raw.match(/^venue:\s*"((?:[^"\\]|\\.)*)"/m);
  const typeMatch  = raw.match(/^type:\s*"([^"]*)"/m);
  if (!typeMatch) continue;

  const venue   = venueMatch ? venueMatch[1].replace(/\\"/g, '"') : '';
  const oldType = typeMatch[1];
  const newType = classifyVenue(venue);

  counts[newType] = (counts[newType] ?? 0) + 1;

  if (oldType === newType) {
    kept++;
    continue;
  }

  const updated = raw.replace(/^type:\s*"[^"]*"/m, `type: "${newType}"`);
  writeFileSync(path, updated, 'utf-8');
  changed++;
}

console.log(`[reclassify] Updated: ${changed}, unchanged: ${kept}`);
console.log('[reclassify] Final distribution:');
for (const [t, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t.padEnd(14)} ${n}`);
}
