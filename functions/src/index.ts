import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { logger } from "firebase-functions";
import nodemailer = require("nodemailer");

initializeApp();

const mailUser = defineString("mail.user");
const mailPass = defineString("mail.pass");
const mailTo = defineString("mail.to");
const githubToken = defineString("github.token");
const githubOwner = defineString("github.owner");
const githubRepo = defineString("github.repo");
const githubBranch = defineString("github.branch");

export const notifyContact = onDocumentCreated(
  {
    region: "asia-south1",
    document: "contactSubmissions/{submissionId}",
  },
  async (event) => {
    const data = event.data?.data() ?? {};

    const name = (data.name as string) || "Unknown";
    const email = (data.email as string) || "-";
    const company = (data.company as string) || "-";
    const country = (data.country as string) || "-";
    const phone = (data.phone as string) || "-";
    const message = (data.message as string) || "(no message provided)";

    const user = mailUser.value();
    const pass = mailPass.value();
    const toAddress = mailTo.value() || user;

    if (!user || !pass || !toAddress) {
      logger.error("Mail config missing; cannot send contact notification");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nCountry: ${country}\nMessage: ${message}`;

    await transporter.sendMail({
      from: `Eltra Overseas <${user}>`,
      to: toAddress,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text,
    });
  },
);

export const uploadImageToRepo = onCall(
  { region: "asia-south1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in to upload images");
    }

    const { filename, contentBase64, mimeType } = request.data as {
      filename: string;
      contentBase64: string;
      mimeType: string;
    };

    if (!filename || !contentBase64 || !mimeType) {
      throw new HttpsError("invalid-argument", "filename, contentBase64, and mimeType are required");
    }

    if (!mimeType.startsWith("image/")) {
      throw new HttpsError("invalid-argument", "Only image files are allowed");
    }

    // Estimate decoded size from base64 length
    const sizeBytes = Math.ceil((contentBase64.length * 3) / 4);
    if (sizeBytes > 5 * 1024 * 1024) {
      throw new HttpsError("invalid-argument", "File size exceeds 5 MB limit");
    }

    const token = githubToken.value();
    const owner = githubOwner.value();
    const repo = githubRepo.value();
    const branch = githubBranch.value() || "master";

    if (!token || !owner || !repo) {
      throw new HttpsError("internal", "GitHub configuration is missing");
    }

    // Sanitise filename: lowercase, replace spaces/special chars with hyphens
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const base = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const sanitisedFilename = `${base}.${ext}`;
    const filePath = `public/uploads/${sanitisedFilename}`;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };

    // Check if file already exists to get its SHA (required for updates)
    let existingSha: string | undefined;
    const checkResp = await fetch(apiUrl, { headers });
    if (checkResp.ok) {
      const existing = (await checkResp.json()) as { sha: string };
      existingSha = existing.sha;
    }

    // Create or update the file via GitHub API
    const body: Record<string, unknown> = {
      message: `chore: upload image ${sanitisedFilename}`,
      content: contentBase64,
      branch,
    };
    if (existingSha) body.sha = existingSha;

    const uploadResp = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!uploadResp.ok) {
      const errBody = (await uploadResp.json()) as { message?: string };
      logger.error("GitHub upload failed", errBody);
      throw new HttpsError("internal", `GitHub API error: ${errBody.message ?? uploadResp.status}`);
    }

    const siteUrl = `https://www.eltraoverseas.com/uploads/${sanitisedFilename}`;
    const githubRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public/uploads/${sanitisedFilename}`;

    const db = getFirestore();
    const docRef = db.collection("uploadedImages").doc();
    const imageData = {
      filename: sanitisedFilename,
      siteUrl,
      githubRawUrl,
      mimeType,
      size: sizeBytes,
      uploadedAt: new Date(),
    };
    await docRef.set(imageData);

    return { id: docRef.id, ...imageData, uploadedAt: imageData.uploadedAt.toISOString() };
  },
);

export const deleteUploadedImage = onCall(
  { region: "asia-south1" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in to delete images");
    }

    const { firestoreId, filename } = request.data as {
      firestoreId: string;
      filename: string;
    };

    if (!firestoreId || !filename) {
      throw new HttpsError("invalid-argument", "firestoreId and filename are required");
    }

    const token = githubToken.value();
    const owner = githubOwner.value();
    const repo = githubRepo.value();
    const branch = githubBranch.value() || "master";

    if (!token || !owner || !repo) {
      throw new HttpsError("internal", "GitHub configuration is missing");
    }

    const filePath = `public/uploads/${filename}`;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };

    // Fetch current SHA before deleting
    const checkResp = await fetch(apiUrl, { headers });
    if (checkResp.ok) {
      const existing = (await checkResp.json()) as { sha: string };
      const deleteResp = await fetch(apiUrl, {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          message: `chore: delete image ${filename}`,
          sha: existing.sha,
          branch,
        }),
      });
      if (!deleteResp.ok) {
        const errBody = (await deleteResp.json()) as { message?: string };
        logger.error("GitHub delete failed", errBody);
        throw new HttpsError("internal", `GitHub API error: ${errBody.message ?? deleteResp.status}`);
      }
    }

    // Remove metadata from Firestore regardless of GitHub result
    const db = getFirestore();
    await db.collection("uploadedImages").doc(firestoreId).delete();

    return { success: true };
  },
);
