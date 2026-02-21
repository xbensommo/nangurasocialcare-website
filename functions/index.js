/* eslint-disable comma-dangle */
/* eslint-disable padded-blocks */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/**
 * @file index.js
 * @description Nangura Social Care - Automated Clinical Infrastructure
 */

const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();
const { FieldValue } = require("firebase-admin/firestore");

const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { google } = require("googleapis");

const { dispatchNotification } = require("./notifier");
const { emailTemplates } = require("./emailTemplates");

const NANGURA_CFG = { region: "europe-west3", memory: "256MiB", concurrency: 80 };

/**
 * Automatically assigns Custom Claims based on the Firestore user role.
 * Trigger: Background (Firestore Create)
 */
exports.onUserCreated = onDocumentCreated(
    { ...NANGURA_CFG, document: "users/{uid}" },
    async (event) => {
      try {
        const snapshot = event.data;
        const { uid } = event.params;

        if (!snapshot) {
          console.log("No snapshot data available");
          return;
        }

        const role = snapshot.data().role;

        if (!role) {
          console.log(`No role found for user ${uid}, skipping claims assignment`);
          return;
        }

        const claims = { user: role === "user" };
        await admin.auth().setCustomUserClaims(uid, claims);
        console.log(`✅ Claims set for user ${uid}:`, claims);

      } catch (error) {
        console.error(`❌ Error setting claims for user:`, error);
        throw error;
      }
    }
);

/**
 * Handles Session Creation: Logs notification to DB and dispatches email.
 * Trigger: Background (Firestore Create)
 */
exports.onSessionCreated = onDocumentCreated(
    { ...NANGURA_CFG, document: "sessions/{id}", secrets: ["EMAIL_PASS"] }, 
    async (event) => {
        const session = event.data.data();
        const { id } = event.params;
        const uid = session.userId;

        try {
            // --- DATABASE CONCERN 1: Fetch User Email ---
            const userDoc = await db.collection("users").doc(uid).get();
            if (!userDoc.exists) {
                console.warn(`User ${uid} not found for session ${id}`);
                return;
            }
            const recipientEmail = userDoc.data().email;

            // --- DATABASE CONCERN 2: Write In-App Notification ---
            const notificationTitle = "Booking Confirmed | Nangura Social Care";
            const notificationBody = `Confirmed for ${session.date} at ${session.time}.`;
            
            await db.collection("notifications").add({
                uid: uid,
                title: notificationTitle,
                message: notificationBody,
                data: { type: "BOOKING", id },
                read: false,
                createdAt: FieldValue.serverTimestamp(),
            });

            // --- NOTIFICATION CONCERN: Dispatch External Email ---
            if (recipientEmail) {
                await dispatchNotification({
                    to: recipientEmail,
                    subject: notificationTitle,
                    templateHtml: emailTemplates.bookingConfirmed(session, 'meetlink') // Pass actual link when Google Meet integration is active
                });
            }

        } catch (error) {
            console.error(`❌ Session creation handler failed for ${id}:`, error);
        }
    }
);