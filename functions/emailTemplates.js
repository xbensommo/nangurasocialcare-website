/**
 * @file emailTemplates.js
 * @description Clinical Email Templates for Nangura Social Care
 */
const {defineString} = require("firebase-functions/params");

const appDomain = defineString("APP_DOMAIN", {default: "https://nangurasocialcare.org"});

const PRIMARY_COLOR = "#1A365D"; // Deep Calm Blue
const ACCENT_COLOR = "#718096";  // Professional Slate
const BG_COLOR = "#FAFAF9";      // Off-white/Stone

const wrapLayout = (header, content) => ({
    header,
    html: `
    <div style="background-color: ${BG_COLOR}; padding: 40px 20px; font-family: 'serif', 'Times New Roman'; color: #2D3748;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; border: 1px solid #E2E8F0;">
        <div style="background: ${PRIMARY_COLOR}; padding: 40px; text-align: center;">
          <h1 style="color: white; font-size: 18px; font-style: italic; margin: 0; letter-spacing: 1px;">${header}</h1>
        </div>
        <div style="padding: 40px; line-height: 1.8; font-size: 15px;">
          ${content}
        </div>
        <div style="padding: 20px; text-align: center; font-size: 11px; color: ${ACCENT_COLOR};">
          <p>© ${new Date().getFullYear()} Nangura Social Care Namibia</p>
          <p>Confidentiality is the cornerstone of our care.</p>
        </div>
      </div>
    </div>
  `
});

const emailTemplates = {
    bookingConfirmed: (session, meetLink) => wrapLayout("Your Session is Confirmed", `
    <p>Dear ${session.fullName},</p>
    <p>Your appointment for <strong>${session.service.title}</strong> has been successfully scheduled.</p>
    <div style="margin: 20px 0; padding: 20px; border-left: 4px solid ${PRIMARY_COLOR}; background: #F7FAFC;">
      <p style="margin: 0;"><strong>Date:</strong> ${session.date}</p>
      <p style="margin: 0;"><strong>Time:</strong> ${session.time} (CAT)</p>
    </div>
    ${meetLink ? `
      <p>This is an online session. Please join using the button below:</p>
      <div style="text-align:center; margin: 30px 0;">
        <a href="${meetLink}" style="background:${PRIMARY_COLOR}; color:white; padding:15px 30px; text-decoration:none; border-radius: 12px; font-weight:bold;">Join Virtual Room</a>
      </div>
    ` : `<p>Location: Nangura Social Care Center, Tsumeb.</p>`}
    <p style="font-size: 12px; color: ${ACCENT_COLOR}; italic;">Please notify us 24 hours in advance if you need to reschedule.</p>
  `),

    adminNewBooking: (session) => wrapLayout("New Appointment Alert", `
    <p>Bertha, you have a new booking.</p>
    <p><strong>Client:</strong> ${session.fullName}</p>
    <p><strong>Service:</strong> ${session.service.title}</p>
    <p><strong>Time:</strong> ${session.date} @ ${session.time}</p>
    <div style="text-align:center; margin: 30px 0;">
      <a href="${appDomain.value()}/admin" style="background:${ACCENT_COLOR}; color:white; padding:12px 24px; text-decoration:none; border-radius: 8px;">View Client File</a>
    </div>
  `),
    reminder: (session) => wrapLayout("Today's Session Reminder", `
        <p>This is a gentle reminder for your session today.</p>
        <p><strong>Time:</strong> ${session.time} (CAT)</p>
        <p>Looking forward to connecting with you.</p>
    `),

    genericNotice: (title, message) => wrapLayout(title, `
        <p>${message}</p>
    `),
};

module.exports = {emailTemplates};