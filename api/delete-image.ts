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

  const { filename } = req.body as { filename: string };
  if (!filename) {
    return res.status(400).json({ error: "filename is required" });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return res.status(500).json({ error: "GitHub token not configured" });
  }

  const filePath = `public/uploads/${filename}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  const ghHeaders: Record<string, string> = {
    Authorization: `Bearer ${githubToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  const checkResp = await fetch(apiUrl, { headers: ghHeaders });
  if (!checkResp.ok) {
    // File not found on GitHub — nothing to delete
    return res.status(200).json({ success: true });
  }

  const existing = (await checkResp.json()) as { sha: string };
  const deleteResp = await fetch(apiUrl, {
    method: "DELETE",
    headers: ghHeaders,
    body: JSON.stringify({
      message: `chore: delete image ${filename}`,
      sha: existing.sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!deleteResp.ok) {
    const errBody = (await deleteResp.json()) as { message?: string };
    return res.status(500).json({ error: errBody.message ?? "GitHub API error" });
  }

  return res.status(200).json({ success: true });
}
