# GoblinTechUK

GoblinTechUK is a Next.js site for showing curated UK tech, gaming and electronics deals from affiliate partner feeds. The public site reads deal data from `public/deals.json` and renders Featured Offers, product categories, search, sorting, affiliate outbound links, SEO metadata, sitemap and robots output.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS-in-JSX styling inside the current page/components
- Static JSON feed at `public/deals.json`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build And Checks

```bash
npm run lint
npm run build
```

## Site URL Configuration

Production URLs are read from `NEXT_PUBLIC_SITE_URL`. If the variable is not set, the app falls back to:

```text
https://www.goblintechuk.uk
```

This value is used by metadata, canonical URLs, `sitemap.xml`, and `robots.txt`.

## Deal Feed

The frontend expects `public/deals.json` to contain an array of deal objects. Important fields include:

```ts
{
  title: string;
  cleanTitle?: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  category: string;
  quality: string;
  merchant?: string;
  source: string;
  link: string;
  image: string;
  timestamp: string;
  dealType?: string;
  offerEndDate?: string;
}
```

Affiliate redirects are handled in the frontend for supported merchants, while the JSON feed keeps the original merchant URL.

## SEO

The app provides:

- Next.js metadata in `app/layout.tsx`
- Open Graph and Twitter card data
- JSON-LD structured data
- `app/sitemap.ts`
- `app/robots.ts`
- Ahrefs Web Analytics loaded with `next/script`

## Project Layout

```text
app/
  components/      Shared UI sections used by the homepage
  lib/site.ts      Canonical site URL and metadata strings
  page.tsx         Homepage data loading and deal rendering
  layout.tsx       Global metadata, fonts, analytics and schema
  robots.ts        robots.txt generation
  sitemap.ts       sitemap.xml generation
public/
  deals.json       Live deal feed consumed by the homepage
  images/partners/ Partner logos used by offers and deal cards
```
