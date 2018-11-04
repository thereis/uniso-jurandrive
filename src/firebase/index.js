import * as firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyBG1CJYrNLPGNQAEJQ-TSe9BJ3SNWKty0I",
  authDomain: "unidrive-3a64f.firebaseapp.com",
  databaseURL: "https://unidrive-3a64f.firebaseio.com",
  projectId: "unidrive-3a64f",
  storageBucket: "unidrive-3a64f.appspot.com",
  messagingSenderId: "123579635698"
});

const firestore = firebase.firestore();
const storage = firebase.storage();

firestore.settings({ timestampsInSnapshots: true });

export { firebase, firestore, storage };
