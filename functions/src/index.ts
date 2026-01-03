import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

admin.initializeApp();

const mailConfig = functions.config().mail || {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

export const notifyContact = functions
  .region("asia-south1")
  .firestore.document("contactSubmissions/{submissionId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();

    const name = data.name || "Unknown";
    const email = data.email || "-";
    const company = data.company || "-";
    const country = data.country || "-";
    const phone = data.phone || "-";
    const message = data.message || "(no message provided)";

    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nCountry: ${country}\nMessage: ${message}`;

    const toAddress = mailConfig.to || mailConfig.user;

    if (!mailConfig.user || !mailConfig.pass || !toAddress) {
      functions.logger.error("Mail config missing; cannot send contact notification");
      return;
    }

    await transporter.sendMail({
      from: `Eltra Overseas <${mailConfig.user}>`,
      to: toAddress,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text,
    });
  });
