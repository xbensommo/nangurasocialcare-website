const nodemailer = require("nodemailer");

/**
 * Configured for Zoho Mail (Nangura's professional mail)
 */
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, 
    auth: {
        user: "info@nangurasocialcare.org", 
        pass: process.env.ZOHO_PASSWORD, // Set this in Firebase Secrets
    },
});

async function sendEmail({to, subject, html}) {
    return transporter.sendMail({
        from: '"Nangura Social Care" <info@nangurasocialcare.org>',
        to,
        subject,
        html,
    });
}

module.exports = {sendEmail};