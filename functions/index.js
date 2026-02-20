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
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const {google} = require("googleapis");

if (!admin.apps.length) admin.initializeApp();

const {dispatchNotification} = require("./notifier");
const {emailTemplates} = require("./emailTemplates");

const NANGURA_CFG = {region: "europe-west3", memory: "256MiB", concurrency: 80};

/** * 1. SESSION CREATED 
 * Action: Create Meet Link & Notify
 */

/**
 * Trigger: On Session Booking Created
 * Action: Generate Google Meet link for online sessions and notify Bertha/Client.
 */

/**
 * Internal Helper: Google Meet Generator
 * Uses Service Account Delegation to act on behalf of the owner.
 */
async function createGoogleMeet(session) {
    const auth = new google.auth.JWT(
        process.env.SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/calendar"],
        "bertha@nangurasocialcare.org" // THE OWNER'S EMAIL (Delegation)
    );

    const calendar = google.calendar({version: "v3", auth});
    
    const event = {
        summary: `Nangura Session: ${session.fullName}`,
        description: `Clinical Social Care Session. Service: ${session.service.title}`,
        start: {dateTime: `${session.date}T${session.time}:00`, timeZone: "Africa/Windhoek"},
        end: {dateTime: `${session.date}T${session.time}:00`, timeZone: "Africa/Windhoek"}, // Add logic for duration
        conferenceData: {
            createRequest: {
                requestId: `nangura-${Date.now()}`,
                conferenceSolutionKey: {type: "hangoutMeet"}
            }
        },
        attendees: [{email: session.email}],
    };

    const res = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1
    });

    return res.data.hangoutLink;
}


exports.onSessionCreated = onDocumentCreated({...NANGURA_CFG, document: "sessions/{id}"}, async (event) => {
    const session = event.data.data();
    const {id} = event.params;
    const lockRef = admin.firestore().collection("_locks").doc(id);

    return admin.firestore().runTransaction(async (t) => {
        const lock = await t.get(lockRef);
        if (lock.exists) return;

        let meetLink = null;
        let googleEventId = null;

        if (session.requiresMeet) {
            const cal = await createCalendarEvent(session);
            meetLink = cal.hangoutLink;
            googleEventId = cal.id;
        }

        t.update(event.data.ref, {
            meetLink,
            googleEventId,
            status: "confirmed",
            processedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await dispatchNotification(session.userId, {
            subject: "Booking Confirmed | Nangura Social Care",
            body: `Confirmed for ${session.date} at ${session.time}.`,
            templateHtml: emailTemplates.bookingConfirmed(session, meetLink),
            data: {type: "BOOKING", id},
        });

        t.set(lockRef, {processedAt: Date.now()});
    });
});

/** * 2. SESSION CANCELLED 
 * Action: Remove from Google Calendar & Notify
 */
exports.onSessionUpdated = onDocumentUpdated({...NANGURA_CFG, document: "sessions/{id}"}, async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (before.status !== "cancelled" && after.status === "cancelled") {
        if (after.googleEventId) {
            await deleteCalendarEvent(after.googleEventId);
        }

        await dispatchNotification(after.userId, {
            subject: "Session Cancelled",
            body: "Your session has been cancelled as requested.",
            templateHtml: emailTemplates.genericNotice("Session Cancelled", "Your appointment has been successfully removed from our schedule."),
            data: {type: "CANCEL"},
        });
    }
});

/** * 3. DAILY MORNING REMINDERS (Future-Proofing)
 * Runs daily at 07:00 AM CAT to remind clients of today's sessions.
 */
exports.dailyReminders = onSchedule({...NANGURA_CFG, schedule: "0 7 * * *", timeZone: "Africa/Windhoek"}, async (event) => {
    const today = new Date().toISOString().split('T')[0];
    const snapshots = await admin.firestore().collection("sessions")
        .where("date", "==", today)
        .where("status", "==", "confirmed")
        .get();

    const tasks = snapshots.docs.map(doc => {
        const session = doc.data();
        return dispatchNotification(session.userId, {
            subject: "Reminder: Session Today",
            body: `Friendly reminder of your session today at ${session.time}.`,
            templateHtml: emailTemplates.reminder(session),
            data: {type: "REMINDER"},
        });
    });

    await Promise.all(tasks);
    console.log(`Sent ${tasks.length} reminders for ${today}`);
});


/**
 * Automatically assigns Custom Claims based on the Firestore user role.
 * Trigger: Background (Firestore Create)
 */
exports.onUserCreated = onDocumentCreated(
    {...NANGURA_CFG, document: "users/{uid}"},
    async (event) => {
      try {
        console.log(event);
        // 1. Get the snapshot and params from the v2 event object
        const snapshot = event.data;
        const {uid} = event.params;

        // Safety Check: If no snapshot exists, the document was deleted.
        if (!snapshot) {
          console.log("No snapshot data available");
          return;
        }

        const data = snapshot.data();
        const role = data.role;

        if (!role) {
          console.log(`No role found for user ${uid}, skipping claims assignment`);
          return;
        }

        // 2. Define claims logic
        const claims = {
          user: role === "user",
          // Add a timestamp to force token refresh on client side if needed
          updatedAt: Date.now(),
        };

        // 3. Set the claims via Admin SDK
        await admin.auth().setCustomUserClaims(uid, claims);
        console.log(`✅ Claims set for user ${uid}:`, claims);

      } catch (error) {
        console.error(`❌ Error setting claims for user:`, error);
        // Re-throw the error to ensure Firebase knows it failed
        throw error;
      }
    }
);

/** --- GOOGLE CALENDAR HELPERS --- **/

async function getOAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return oauth2Client;
}

async function createCalendarEvent(session) {
    const auth = await getOAuthClient();
    const calendar = google.calendar({version: "v3", auth});
    
    const res = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        resource: {
            summary: `Nangura: ${session.fullName}`,
            start: {dateTime: `${session.date}T${session.time}:00`, timeZone: "Africa/Windhoek"},
            end: {dateTime: `${session.date}T${session.time}:00`, timeZone: "Africa/Windhoek"},
            conferenceData: {createRequest: {requestId: session.userId + Date.now(), conferenceSolutionKey: {type: "hangoutMeet"}}}
        }
    });
    return res.data;
}

async function deleteCalendarEvent(eventId) {
    const auth = await getOAuthClient();
    const calendar = google.calendar({version: "v3", auth});
    await calendar.events.delete({calendarId: "primary", eventId});
}