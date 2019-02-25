import firebase from 'firebase'
import 'firebase/firestore'
const config = {
  apiKey: "AIzaSyDE_d6toQ-RtW4zkHPKsAXrI9oVdW7u-SU",
  authDomain: "messages-8dfcf.firebaseapp.com",
  databaseURL: "https://messages-8dfcf.firebaseio.com",
  projectId: "messages-8dfcf",
  storageBucket: "messages-8dfcf.appspot.com",
  messagingSenderId: "495629663799"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

export default db