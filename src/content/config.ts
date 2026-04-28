import { defineCollection, z } from 'astro:content';

// Helper: accepts any string including [REQUIRED: ...] placeholders
const str  = () => z.string().default('');
const ostr = () => z.string().optional();

// ─── Settings ────────────────────────────────────────────────
const settings = defineCollection({
  type: 'data',
  schema: z.object({
    siteName: str(),
    siteTagline: str(),
    siteDescription: str(),
    logoFile: str(),
    logoSvg: ostr(),
    googleScholarGroupUrl: ostr(),
    formspreeEndpoint: ostr(),
    instagramHandle: ostr(),
    linkedinPageUrl: ostr(),
    youtubeChannelUrl: ostr(),
    twitterHandle: ostr(),
    emailPrimary: str(),
    emailSecondary: ostr(),
    address: ostr(),
    googleMapsEmbed: ostr(),
    colors: z.object({
      primary:   str(),
      secondary: str(),
      accent:    str(),
      neutral:   str(),
    }).optional(),
    stats: z.object({
      phd:       z.number().default(0),
      masters:   z.number().default(0),
      undergrad: z.number().default(0),
    }).optional(),
  }),
});

// ─── Pages ───────────────────────────────────────────────────
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: ostr(),
    lastUpdated: ostr(),
  }),
});

// ─── Team ─────────────────────────────────────────────────────
const team = defineCollection({
  type: 'content',
  schema: z.object({
    name:          z.string(),
    title:         ostr(),
    role:          z.enum(['Principal Investigator', 'Postdoc', 'Visiting Scholar', 'PhD Student', 'Masters Student', 'Undergraduate', 'Staff']),
    photo:         ostr(),
    bio:           str(),
    email:         ostr(),
    orcid:         ostr(),
    researcherId:  ostr(),
    researchgate:  ostr(),
    googleScholar: ostr(),
    lattes:        ostr(),
    instagram:     ostr(),
    linkedin:      ostr(),
    twitter:       ostr(),
    researchLines: z.array(z.string()).default([]),
    highlights:    z.array(z.string()).default([]),
    active:        z.boolean().default(true),
    order:         z.number().optional(),
  }),
});

// ─── Research Areas ───────────────────────────────────────────
const researchAreas = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    icon:         ostr(),
    summary:      z.string(),
    projects:     z.array(z.string()).default([]),
    publications: z.array(z.string()).default([]),
    color:        ostr(),
    order:        z.number().optional(),
  }),
});

// ─── Projects ─────────────────────────────────────────────────
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    partner:      ostr(),
    funding:      ostr(),
    grantNumber:  ostr(),
    status:       z.enum(['active', 'concluded', 'paused']),
    startDate:    ostr(),
    endDate:      ostr(),
    description:  z.string(),
    researchArea: ostr(),
    members:      z.array(z.string()).default([]),
    highlights:   z.array(z.string()).default([]),
    cover:        ostr(),
    video:        ostr(),
    tags:         z.array(z.string()).default([]),
    featured:     z.boolean().default(false),
  }),
});

// ─── Publications ─────────────────────────────────────────────
const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    authors:      z.array(z.string()).default([]),
    venue:        ostr(),
    year:         z.number().nullable().optional(),
    doi:          ostr(),
    url:          ostr(),
    type:         z.enum(['journal', 'conference', 'book-chapter', 'thesis', 'preprint', 'other']).default('other'),
    researchArea: ostr(),
    abstract:     ostr(),
    tags:         z.array(z.string()).default([]),
    featured:     z.boolean().default(false),
    scholarId:    ostr(),
  }),
});

// ─── Collaborations ───────────────────────────────────────────
const collaborations = defineCollection({
  type: 'content',
  schema: z.object({
    name:        z.string(),
    type:        z.enum(['university', 'company', 'government', 'research-institute', 'ngo']),
    country:     str(),
    logo:        ostr(),
    url:         ostr(),
    description: ostr(),
    featured:    z.boolean().default(false),
    order:       z.number().optional(),
  }),
});

export const collections = {
  settings,
  pages,
  team,
  'research-areas': researchAreas,
  projects,
  publications,
  collaborations,
};
