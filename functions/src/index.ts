import { initializeApp } from "firebase-admin/app";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineString } from "firebase-functions/params";
import { logger } from "firebase-functions";
import nodemailer = require("nodemailer");

initializeApp();

const mailUser = defineString("mail.user");
const mailPass = defineString("mail.pass");
const mailTo = defineString("mail.to");

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
