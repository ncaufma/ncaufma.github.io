/**
 * Reclassifies English publications into the six NCA research areas.
 * Heuristic-only: ambiguous publications remain unclassified.
 *
 * Usage:
 *   node scripts/reclassify-research-areas.mjs --dry-run
 *   node scripts/reclassify-research-areas.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB_DIR = join(__dirname, '..', 'src', 'content', 'publications', 'en');
const DRY_RUN = process.argv.includes('--dry-run');

const rules = [
  {
    area: 'computer-vision-medical-imaging',
    strong: [
      'computer vision', 'medical image', 'medical imaging', 'radiograph', 'mammograph',
      'colonoscopy', 'endoscopy', 'histopath', 'ultrasound', 'fundus', 'glaucoma',
      'strabismus', 'corneal', 'cornea', 'retina', 'retinal', 'oct ', 'tomography',
      'segmentation', 'lung nodule', 'breast cancer', 'skin lesion', 'melanoma',
      'penile cancer', 'colorectal', 'polyp', 'chest x-ray', 'chest x ray',
      'pneumonia', 'tuberculosis', 'prostate', 'kidney tumor', 'pancreas',
      'liver lesion', 'cardiac structure', 'vertebrae', 'osteoporosis',
      'concrete pathology', 'crack detection', 'rock porosity', 'sandstone',
      'eye detection', 'face detection', 'microtomographic', 'tomographic',
      'endoscopic', 'endoscopy', 'endometriosis', 'concrete structures',
    ],
  },
  {
    area: 'natural-language-processing',
    strong: [
      'natural language', 'language model', 'large language', 'hate speech',
      'sexism', 'sentiment analysis', 'twitter microtext', 'text classification',
      'text mining', 'linguistic', 'seismic trace', 'tracepiece',
      'medical report', 'named entity',
    ],
  },
  {
    area: 'virtual-augmented-reality',
    strong: [
      'virtual reality', 'augmented reality', 'mixed reality', 'motion capture',
      'head-mounted', 'head mounted', 'immersive', 'scenic performance',
    ],
  },
  {
    area: 'software-engineering-ux',
    strong: [
      'usability', 'user experience', 'software quality', 'software engineering',
      'accessibility', 'assistive', 'ergonomic', 'ergonomics', 'autistic',
      'assistive technology', 'ux evaluation', 'human-computer', 'hci',
      'gamification', 'requirements elicitation', 'applying checklist',
      'inspection technique',
    ],
  },
  {
    area: 'logistics-optimization',
    strong: [
      'vehicle routing', 'truck dispatch', 'traffic counting',
      'train timetabling', 'job scheduling', 'traveling salesman',
      'timetabling', 'logistics', 'sensor location', 'port scheduling',
      'maritime terminal', 'truck', 'dispatch optimization',
      'benders decomposition', 'covering tour',
    ],
  },
  {
    area: 'ai-data-science',
    strong: [
      'machine learning', 'deep learning', 'data mining', 'data science',
      'artificial intelligence', 'artificial neural', 'neural network',
      'time series', 'forecast', 'clustering', 'ensemble', 'xgboost',
      'random forest', 'anomaly detection', 'missing data', 'imbalanced',
    ],
  },
];

const files = readdirSync(PUB_DIR).filter(file => file.endsWith('.md'));
const counts = Object.fromEntries(rules.map(rule => [rule.area, 0]));
let ambiguous = 0;
let changed = 0;
let kept = 0;

for (const file of files) {
  const path = join(PUB_DIR, file);
  const raw = readFileSync(path, 'utf-8');
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) continue;

  const titleMatch = frontmatter[1].match(/^title:\s*"((?:[^"\\]|\\.)*)"/m);
  const venueMatch = frontmatter[1].match(/^venue:\s*"((?:[^"\\]|\\.)*)"/m);
  const abstractMatch = frontmatter[1].match(/^abstract:\s*"((?:[^"\\]|\\.)*)"/m);
  const text = [
    titleMatch?.[1] ?? '',
    venueMatch?.[1] ?? '',
    abstractMatch?.[1] ?? '',
  ].join(' ').toLowerCase();

  const matchedRule = rules.find(rule =>
    rule.strong.some(term => text.includes(term)),
  );
  const area = matchedRule?.area ?? '';

  if (!area) ambiguous++;
  else counts[area]++;

  const oldMatch = frontmatter[1].match(/^researchArea:\s*"[^"]*"/m);
  const oldArea = oldMatch ? oldMatch[0].match(/"([^"]*)"/)?.[1] ?? '' : '';
  if (oldArea === area) {
    kept++;
    continue;
  }

  changed++;
  if (!DRY_RUN) {
    const block = oldMatch
      ? frontmatter[1].replace(/^researchArea:\s*"[^"]*"/m, `researchArea: "${area}"`)
      : `${frontmatter[1]}\nresearchArea: "${area}"`;
    const updated = raw.replace(frontmatter[1], block);
    writeFileSync(path, updated, 'utf-8');
  }
}

console.log(`[research-areas] Files: ${files.length}`);
console.log(`[research-areas] Changed: ${changed}, unchanged: ${kept}, ambiguous: ${ambiguous}`);
for (const rule of rules) console.log(`  ${rule.area}: ${counts[rule.area]}`);
