import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedFilePath = resolve(__dirname, "../firebase-seed/seed-data.json");

async function loadSeedData() {
  const file = await readFile(seedFilePath, "utf-8");
  return JSON.parse(file);
}

async function seedSiteContent(db, siteContent) {
  if (!siteContent?.home) return;
  await db.collection("siteContent").doc("home").set(siteContent.home, { merge: true });
  console.log("✔ siteContent/home updated");
}

async function seedCollection(db, collectionId, records) {
  if (!records) return;
  const entries = Object.entries(records);
  for (const [docId, data] of entries) {
    await db.collection(collectionId).doc(docId).set(data, { merge: true });
    console.log(`✔ ${collectionId}/${docId} written`);
  }
}

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn("⚠ Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON before running this script.");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();
  const seed = await loadSeedData();

  await seedSiteContent(db, seed.siteContent);
  await seedCollection(db, "products", seed.products);
  await seedCollection(db, "vlogs", seed.vlogs);

  console.log("🎉 Firestore seed complete");
}

main().catch((error) => {
  console.error("❌ Failed to seed Firestore", error);
  process.exit(1);
});
