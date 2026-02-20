/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/**
 * @file notifier.js
 * @description Clinical notification dispatcher for Nangura Social Care.
 */

const admin = require("firebase-admin");
const {sendEmail} = require("./emailSender");

/**
 * Dispatches a notification across all Nangura communication channels.
 * Uses Promise.allSettled to ensure email delivery issues don't crash the trigger.
 * * @param {string} uid - The recipient's Firebase User ID
 * @param {Object} payload - {subject, body, templateHtml, data}
 */
async function dispatchNotification(uid, {subject, body, templateHtml, data}) {
  try {
    // 1. Fetch the recipient's profile
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
        console.warn(`Attempted to notify non-existent user: ${uid}`);
        return;
    }

    const userData = userDoc.data();
    const tasks = [];

    // 2. Internal Dashboard Notification (Firestore)
    // This allows the client to see their booking history/alerts in their "My Account" area.
    tasks.push(
        admin.firestore().collection("notifications").add({
          uid,
          title: subject,
          message: body,
          data: data || {},
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })
    );

    // 3. Professional Email (Zoho SMTP via emailSender.js)
    // We prioritize the email stored in the user document
    const recipientEmail = userData.email;
    
    if (recipientEmail && templateHtml) {
      tasks.push(
          sendEmail({
              to: recipientEmail, 
              subject: subject, 
              html: templateHtml
          }).catch((err) => console.error(`Zoho Mail failure for ${recipientEmail}:`, err.message))
      );
    }

    // Execute all tasks in parallel. allSettled ensures if the email fails, 
    // the Firestore notification record is still created.
    const results = await Promise.allSettled(tasks);
    
    // Log failures for clinical auditing
    results.forEach((result, idx) => {
        if (result.status === "rejected") {
            console.error(`Notification task ${idx} failed:`, result.reason);
        }
    });

    return results;
  } catch (error) {
    console.error(`Critical Notification Dispatch Error for ${uid}:`, error);
    throw error; // Re-throw for Cloud Functions retry logic if necessary
  }
}

module.exports = {dispatchNotification};