/**
 * scripts/lib/scholar-fetch.mjs
 *
 * Shared helper that scrapes Google Scholar "Author" pages. Used by:
 *   - scripts/fetch-scholar.mjs            (group/main publications page)
 *   - scripts/fetch-scholar-members.mjs    (per team member publication list)
 *
 * Exports:
 *   fetchScholarPublications(url, { pageSize, maxPages, delayMs, log })
 *     → Promise<Array<{ title, authors, venue, year, type, link }>>
 */

import { classifyVenue } from '../classify-venue.mjs';

function buildPagedUrl(baseUrl, cstart, pagesize) {
  const u = new URL(baseUrl);
  u.searchParams.set('cstart', String(cstart));
  u.searchParams.set('pagesize', String(pagesize));
  return u.toString();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export async function fetchScholarPublications(url, opts = {}) {
  const {
    pageSize = 100,
    maxPages = 20,
    delayMs  = 1500,
    log      = () => {},
  } = opts;

  // Dynamic deps (same as the existing script)
  let fetch, cheerio;
  try {
    ({ default: fetch } = await import('node-fetch'));
    cheerio = await import('cheerio');
  } catch (e) {
    throw new Error('Missing dependencies. Run: npm install node-fetch cheerio');
  }
  const { load } = cheerio;

  const publications = [];

  for (let page = 0; page < maxPages; page++) {
    const cstart  = page * pageSize;
    const pageUrl = buildPagedUrl(url, cstart, pageSize);

    log(`  page ${page + 1} (cstart=${cstart})`);

    let html;
    try {
      const res = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NCA-UFMA-Bot/1.0; +https://ncaufma.github.io)',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        },
      });
      if (!res.ok) {
        log(`  HTTP ${res.status}, stopping`);
        break;
      }
      html = await res.text();
    } catch (e) {
      log(`  network error: ${e.message}`);
      break;
    }

    const $ = load(html);
    const rows = $('.gsc_a_tr');

    if (rows.length === 0) {
      log(`  no more rows, stopping`);
      break;
    }

    let added = 0;
    rows.each((_, row) => {
      const titleEl = $(row).find('.gsc_a_at');
      const title   = titleEl.text().trim();
      const link    = titleEl.attr('href');
      const authors = $(row).find('.gs_gray').first().text().trim();
      const venue   = $(row).find('.gs_gray').last().text().trim();
      const year    = parseInt($(row).find('.gsc_a_y span').text().trim(), 10) || undefined;

      if (!title) return;
      publications.push({
        title,
        authors,
        venue,
        year,
        type: classifyVenue(venue),
        link: link ? `https://scholar.google.com${link}` : '',
      });
      added++;
    });

    log(`  +${added} (running total: ${publications.length})`);

    if (rows.length < pageSize) break;
    await sleep(delayMs);
  }

  return publications;
}
