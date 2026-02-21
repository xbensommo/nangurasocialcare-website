/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/**
 * @file notifier.js
 * @description External communication dispatcher. Agnostic to database logic.
 */

const { sendEmail } = require("./emailSender");

/**
 * Dispatches an external email notification.
 * @param {Object} payload - {to, subject, templateHtml}
 */
async function dispatchNotification({ to, subject, templateHtml }) {
  try {
    if (!to || !templateHtml) {
        console.warn("Skipping email dispatch: Missing recipient or HTML template.");
        return;
    }

    await sendEmail({
        to: to,
        subject: subject,
        html: templateHtml
    });
    
    console.log(`✅ Email dispatched successfully to ${to}`);

  } catch (error) {
    console.error(`❌ Mail delivery failure for ${to}:`, error.message);
    // Depending on your retry strategy, you can either throw this or swallow it. 
    // Throwing it will cause the Cloud Function to retry if retries are enabled.
  }
}

module.exports = { dispatchNotification };