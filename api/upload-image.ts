// Increase Vercel's default 4.5 MB body limit — base64 of a 5 MB file is ~6.7 MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const ADMIN_EMAIL = "elia470jassy@gmail.com";
const GITHUB_OWNER = "gaurav-bhatia-4080";
const GITHUB_REPO = "eltraoverseas";
const GITHUB_BRANCH = "master";

async function verifyAdmin(authHeader: string | undefined): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const idToken = authHeader.slice(7);
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) return false;
  try {
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!resp.ok) return false;
    const data = (await resp.json()) as { users?: { email: string }[] };
    return data.users?.[0]?.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await verifyAdmin(req.headers.authorization))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { filename, contentBase64, mimeType } = req.body as {
    filename: string;
    contentBase64: string;
    mimeType: string;
  };

  if (!filename || !contentBase64 || !mimeType) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!mimeType.startsWith("image/")) {
    return res.status(400).json({ error: "Only image files are allowed" });
  }

  // Strip any accidental whitespace/newlines that would corrupt the base64
  const cleanBase64 = contentBase64.replace(/\s/g, "");

  const sizeBytes = Math.ceil((cleanBase64.length * 3) / 4);
  if (sizeBytes > 5 * 1024 * 1024) {
    return res.status(400).json({ error: "File exceeds 5 MB limit" });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return res.status(500).json({ error: "GitHub token not configured" });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const base = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .toLowerCase();
  const sanitised = `${base}.${ext}`;
  const filePath = `public/uploads/${sanitised}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  const ghHeaders: Record<string, string> = {
    Authorization: `Bearer ${githubToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  // Fetch existing SHA if the file already exists (required for updates)
  let existingSha: string | undefined;
  const checkResp = await fetch(apiUrl, { headers: ghHeaders });
  if (checkResp.ok) {
    const existing = (await checkResp.json()) as { sha: string };
    existingSha = existing.sha;
  }

  const body: Record<string, unknown> = {
    message: `chore: upload image ${sanitised}`,
    content: cleanBase64,
    branch: GITHUB_BRANCH,
  };
  if (existingSha) body.sha = existingSha;

  const uploadResp = await fetch(apiUrl, {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify(body),
  });

  if (!uploadResp.ok) {
    const errBody = (await uploadResp.json()) as { message?: string; errors?: unknown };
    return res.status(500).json({
      error: errBody.message ?? "GitHub API error",
      details: errBody.errors,
    });
  }

  return res.status(200).json({
    filename: sanitised,
    siteUrl: `https://www.eltraoverseas.com/uploads/${sanitised}`,
    githubRawUrl: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/uploads/${sanitised}`,
    mimeType,
    size: sizeBytes,
  });
}
