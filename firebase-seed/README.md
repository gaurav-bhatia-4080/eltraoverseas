# Firestore Seed Instructions

Use this folder to populate Firebase quickly:

1. Open the Firebase console → Firestore Database → Data tab.
2. Create the collections and documents shown in `seed-data.json`:
   - Collection `siteContent`, document `home` – paste the JSON object stored under `siteContent.home`.
   - Collection `products` – create documents using the slug as the document ID (e.g. `hex-bolts`) and copy the corresponding JSON block.
   - Collection `vlogs` – same approach, document IDs should match their slugs.
3. For each JSON block you paste, choose "Add field" in the console and reproduce the structure (arrays can be created with the "array" type). If you prefer automation, run a script with the Firebase Admin SDK to iterate through `seed-data.json`.
4. Update image URLs if you upload your own assets (Storage is optional because the site reads public URLs).
5. Adjust Firestore security rules so reads are public and writes require authentication.

After seeding, add your Firebase config to a local `.env` file (copy `.env.example`) and run `npm install && npm run dev`.
