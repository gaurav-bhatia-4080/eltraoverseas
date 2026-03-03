# Image Upload System Plan

## Overview
Build an image upload system in the Admin panel that:
1. Lets admins upload images from the browser
2. Commits images to the GitHub repo at `public/uploads/`
3. Stores metadata in Firestore
4. Displays all uploaded images with copyable URLs

---

## How It Works (End-to-End)

```
Admin Panel (browser)
  → picks image file
  → sends base64 to Firebase Cloud Function
  → Cloud Function calls GitHub REST API
  → GitHub creates commit to public/uploads/<filename>
  → Vercel auto-deploys on new commit
  → Image available at https://www.eltraoverseas.com/uploads/<filename>
  → Metadata saved to Firestore: uploadedImages collection
  → Admin panel shows list of images with copy-URL buttons
```

---

## Step 0: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Note: "Eltra Overseas Image Uploads"
3. Expiration: No expiration (or set a long one)
4. Scopes: check `repo` (full control of private repositories)
5. Click "Generate token" — copy the token immediately

---

## Step 1: Set Firebase Function Environment Variables

Add to `functions/.env` (create if doesn't exist):
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=gaurav-bhatia-4080
GITHUB_REPO=eltraoverseas
GITHUB_BRANCH=master
```

---

## Step 2: New Firebase Cloud Function — `uploadImageToRepo`

File: `functions/src/index.ts` (add new function)

What it does:
- Accepts: `{ filename, contentBase64, mimeType }` from authenticated admin
- Validates: file type (images only), size (max 5MB)
- Calls GitHub API: PUT /repos/{owner}/{repo}/contents/public/uploads/{filename}
- If file already exists, fetches its SHA first (required by GitHub API for updates)
- Saves metadata to Firestore `uploadedImages` collection
- Returns: `{ siteUrl, githubRawUrl, filename }`

Also add: `deleteUploadedImage` Cloud Function
- Accepts: `{ filename, firestoreId }`
- Calls GitHub API to delete the file (requires SHA)
- Removes Firestore document

---

## Step 3: Admin Panel — Image Library Tab

File: `src/pages/Admin.tsx`

Add a new tab "Image Library" to the existing tab navigation.

### Upload UI:
- File input (accept="image/*")
- Drag-and-drop zone
- Image preview before upload
- Upload progress/spinner
- Max size warning (5MB)

### Image List:
- Responsive grid of uploaded images
- Each card shows:
  - Thumbnail preview
  - Filename
  - Upload date
  - "Copy Site URL" button (www.eltraoverseas.com/uploads/...)
  - "Copy Raw URL" button (raw.githubusercontent.com/...)
  - Delete button (with confirmation)

---

## Files to Modify

| File | Change |
|---|---|
| `functions/src/index.ts` | Add `uploadImageToRepo` and `deleteUploadedImage` functions |
| `functions/package.json` | Add `node-fetch` or `axios` if needed (or use native fetch in Node 18+) |
| `src/pages/Admin.tsx` | Add Image Library tab with upload + list UI |
| `functions/.env` | New file: GitHub token + repo config |

---

## Firestore Collection: `uploadedImages`

```typescript
{
  id: string;           // auto-generated
  filename: string;     // e.g. "product-bolts-2024.jpg"
  siteUrl: string;      // https://www.eltraoverseas.com/uploads/product-bolts-2024.jpg
  githubRawUrl: string; // https://raw.githubusercontent.com/gaurav-bhatia-4080/eltraoverseas/master/public/uploads/product-bolts-2024.jpg
  mimeType: string;     // image/jpeg
  size: number;         // bytes
  uploadedAt: Timestamp;
}
```

---

## Notes
- GitHub API has a 100MB per file limit; we enforce 5MB in the function
- Vercel auto-deploys on every push → site URL works after ~1-2 min
- GitHub raw URL works immediately after commit
- Function requires Firebase Auth token (admin must be logged in) to prevent abuse
- Images go into `public/uploads/` which maps to `/uploads/` on the deployed site
