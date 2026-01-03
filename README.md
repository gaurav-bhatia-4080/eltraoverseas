# Eltra Overseas Marketing Site

Single-page React + Vite site for Eltra Overseas, featuring product catalog, vlogs, contact form, and Firestore-backed data.

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Firebase (Firestore for content)
- React Query for data fetching

## Local Development
```bash
npm install
npm run dev
```
Create a `.env` file (see `.env.example`) with your Firebase config before running.

## Building & Deploying
```bash
npm run build
```
Deploy the `dist/` folder (e.g., on Vercel/Netlify/Firebase Hosting). Don’t forget to set the same `VITE_FIREBASE_*` env vars in your hosting provider.

## Firestore Seed
Use `firebase-seed/seed-data.json` with `scripts/seed-firestore.mjs` to populate Firestore via a service account.
