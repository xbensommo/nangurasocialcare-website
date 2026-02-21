/**
 * @file emailSender.js
 * @description Secure SMTP bridge for Zoho Mail.
 */
const nodemailer = require("nodemailer");

// Configuration pulled from Environment/Secrets for security
const SMTP_USER = process.env.EMAIL_USER || "info@nangurasocialcare.org";
const SMTP_PASS = process.env.EMAIL_PASS; // NO HARDCODED STRINGS HERE
const SMTP_FROM = process.env.EMAIL_FROM || '"Nangura Social Care" <info@nangurasocialcare.org>';

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, 
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
    // Adding pool for efficiency if sending multiple notifications
    pool: true,
    maxConnections: 3,
});

/**
 * Sends a secure email via Zoho SMTP
 * @param {Object} options - {to, subject, html}
 */
async function sendEmail({ to, subject, html }) {
    if (!SMTP_PASS) {
        throw new Error("SMTP Credentials missing. Ensure EMAIL_PASS is set in Firebase Secrets.");
    }

    try {
        const info = await transporter.sendMail({
            from: SMTP_FROM,
            to,
            subject,
            html,
        });
        
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("SMTP Transport Error:", error.message);
        throw error; // Re-throw so notifier.js can catch it
    }
}

module.exports = { sendEmail };