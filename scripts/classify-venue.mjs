/**
 * scripts/classify-venue.mjs
 *
 * Heuristic classifier that maps a Scholar "venue" string to one of:
 *   'journal' | 'conference' | 'book-chapter' | 'thesis' | 'other'
 *
 * Used by:
 *   - scripts/fetch-scholar.mjs       (classifies during import)
 *   - scripts/reclassify-pubs.mjs     (re-classifies existing files)
 */

export function classifyVenue(venue) {
  const v = (venue || '').trim();
  if (!v) return 'other';
  const lo = v.toLowerCase();

  // ── Preprint ─────────────────────────────────────────────────
  if (/\b(arxiv|biorxiv|bio\s*rxiv|medrxiv|chemrxiv|preprint)\b/.test(lo)) {
    return 'preprint';
  }

  // ── Thesis / dissertation ────────────────────────────────────
  // Matches patterns like "Universidade Federal do Maranhão, 2020"
  // or "Pontifical Catholic University of Rio de Janeiro, Brazil, 2004"
  // but NOT when there is a volume or page range (those are journals).
  const hasPages  = /\d+\s*[-–]\s*\d+/.test(v);
  const hasVolume = /\s\d+\s*\(\d+\)/.test(v);
  if (!hasPages && !hasVolume &&
      /(universidade|universidad|university|pontif[íi]cia|instituto federal|institute of technology|\bufma\b|\buff\b|\bufrj\b|\busp\b|\bunicamp\b)/i.test(v)) {
    return 'thesis';
  }

  // ── Conference / proceedings (EN + PT) ───────────────────────
  const confRegex = [
    /\bconference\b/, /\bproceedings\b/, /\bworkshop\b/, /\bsymposium\b/, /\bcongress\b/,
    /\bsimp[oó]sio\b/, /\bcongresso\b/, /\banais\b/, /\bjornada\b/, /\bencontro\b/,
    /\bescola regional\b/, /\bsemin[aá]rio\b/, /\bforum\b/, /\bf[oó]rum\b/,
    /\bsal[aã]o de inicia[cç][aã]o\b/, /\bexposition\b/, /\bmeeting\b/,
    /\beai international\b/, /\bsociedade brasileira de computa[cç][aã]o\b/,
    // Brazilian conference acronyms
    /\bsbsi\b/, /\bsbse\b/, /\bsbqs\b/, /\bsbcas\b/, /\bsbie\b/, /\bsbrc\b/,
    /\bsbgames\b/, /\bsibgrapi\b/, /\bwebmedia\b/, /\bctd\b/, /\bwscad\b/,
    /\bcbrn\b/, /\beri-?go\b/, /\bercemapi\b/, /\bepege\b/, /\banpet\b/,
    /\bgeoinfo\b/, /\bwim\b/, /\bwcama\b/, /\bwei\b/, /\bfses\b/, /\bsbbd\b/,
    /\bsbai\b/, /\bwdes\b/, /\brelate-dia\b/,
    // Latin American / international conference acronyms
    /\bciarp\b/, /\bisbi\b/, /\bmiccai\b/, /\bembc\b/, /\bicpr\b/, /\biccv\b/,
    /\bcvpr\b/, /\bicip\b/, /\bicassp\b/, /\bicml\b/, /\bneurips\b/,
    /\bseke\b/, /\bseg\b/, /\bvisigrapp\b/, /\bvisapp\b/, /\bmobihealth\b/,
    /\bscia\b/, /\beai\b/, /\bicete\b/, /\bwacv\b/, /\beccv\b/,
    /\biceis\b/, /\bijcnn\b/, /\bijcai\b/, /\baaai\b/, /\bkdd\b/, /\bcikm\b/,
    /\becai\b/, /\bbracis\b/, /\beniac\b/, /\bihc\b/, /\bihm\b/, /\bwaiaf\b/,
    /\bieee\s+(international|annual|global|winter|summer)\b/,
    /\bacm\s+(international|annual|sigchi|siggraph)\b/,
  ];
  if (confRegex.some(re => re.test(lo))) {
    return 'conference';
  }

  // ── Book chapter ─────────────────────────────────────────────
  // Scholar formats book chapters as "Book Title, PAGES, YEAR"
  // typically with "in", "chapter", "handbook", or a publisher (e.g. Elsevier, Springer).
  if (/\bchapter\b|\bhandbook\b|\bbook\b|\bcompendium\b/.test(lo) ||
      /\beditora\b/.test(lo) || /\bin-?tech\b/.test(lo) ||
      /\btheory and applications\b/.test(lo)) {
    return 'book-chapter';
  }

  // ── Known journal keywords ──────────────────────────────────
  const journalRegex = [
    /\bjournal\b/, /\btransactions\b/, /\bletters\b/, /\breview(s)?\b/,
    /\brevista\b/, /\bmagazine\b/, /\bannals\b/,
    // Specific well-known journals
    /\bheliyon\b/, /\bieee access\b/, /\bneurocomputing\b/,
    /\bneural computing\b/, /\bpattern recognition\b/, /\bartificial intelligence\b/,
    /\bexpert systems\b/, /\bapplied (sciences|soft computing|intelligence)\b/,
    /\bcomputers? (in|and|&)\b/, /\bcomputer methods\b/,
    /\bbiomedical (signal|engineering)\b/,
    /\bmultimedia tools\b/, /\bprocedia computer science\b/,
    /\bmedical.*engineering.*computing\b/, /\bcomputational (statistics|intelligence)\b/,
    /\bnephrology\b/, /\bclinical chemistry\b/, /\brairo\b/,
    /\bcadernos\b/, /\binterfaces cient[íi]ficas\b/, /\bthermology\b/,
    /\bsensors\b/, /\bplos one\b/, /\bscientific reports\b/, /\bnature\b/,
    /\belsevier\b/, /\bspringer\b/, /\bmdpi\b/, /\bphysica\b/,
    /\bhealth informatics\b/, /\bdecision support systems\b/,
    /\b(ieee|acm) transactions\b/,
  ];
  if (journalRegex.some(re => re.test(lo))) {
    return 'journal';
  }

  // ── Journal fallback: volume/issue/page pattern ──────────────
  // Matches "Venue NN (N), NNN-NNN, YEAR" or "Venue NN, NNN-NNN, YEAR"
  if (hasVolume || /\s\d+,\s*\d+[-–]\d+,\s*\d{4}/.test(v)) {
    return 'journal';
  }

  return 'other';
}
