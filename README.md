# Stranger Founders — Website

> Meet Strangers. Build Legacies.

The official site for **Stranger Founders** — an invite-only founder experience.
Built with **React + Vite** and React Router (multi-page). Design is bespoke:
forest / firelight / cream, Fraunces + Manrope + Marck Script, film grain and
scroll reveals — matching the Season 01 brand deck.

## Run it

```bash
npm install     # first time only
npm run dev      # start local dev server → http://localhost:5173
npm run build    # production build → /dist
npm run preview  # preview the production build
```

> Requires Node 16+. (Vite is pinned to v4 for Node 16 compatibility.)

## Structure

```
public/img/          Real assets from the deck (campfire, Ram portrait, poster, favicon)
src/
  components/        Nav, Footer, Logo, Seal, Faq, Reveal, CtaBand, Grain
  pages/             Home, Experience, Season, Partners, Apply, NotFound
  data/content.js    All editorial copy (episodes, tiers, benefits, FAQs, journey)
  index.css          The full design system
```

## Pages

| Route          | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `/`            | The story — hero, why, what, guide, community, CTA   |
| `/experience`  | The 8-movement journey + manifesto                   |
| `/season-01`   | Episodes, the four seats, who's in the room          |
| `/partners`    | Partnership pitch, tiers, benefits, partner FAQ      |
| `/apply`       | Founder / partner application form (`?type=partner`) |

## To finish before launch

- **Wire the form** in `src/pages/Apply.jsx` (`handleSubmit`) to email / a CRM /
  a form service — it currently confirms on the client only.
- Swap placeholder contact details in `src/components/Footer.jsx`
  (`hello@strangerfounders.com`, Instagram handle).
- Add real creator names/photos in `src/data/content.js` + `Season.jsx` as they confirm.
- Replace `public/img/ram.png` / `campfire.png` with final high-res exports if available.

## Deploy

Any static host (Netlify, Vercel, Cloudflare Pages). Run `npm run build` and serve
`/dist`. The included `public/_redirects` keeps client-side routes working on Netlify;
on Vercel add a rewrite of all routes to `/index.html`.
