import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const addMessage = functions.https.onRequest(async (request, response) => {
    const message = request.query.message
    await admin.firestore().collection("messages").add({ username: "user@user.com", message: message, time: new Date() })

    console.log("Success!!!!")
    response.send("Hello from Firebase!");
});
