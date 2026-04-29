import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCliC0nDHHmBo0ZLRjE4TkoMSfML3uy_mY",
  authDomain: "altaivillage.firebaseapp.com",
  projectId: "altaivillage",
  storageBucket: "altaivillage.firebasestorage.app",
  messagingSenderId: "634795394887",
  appId: "1:634795394887:web:b68fc54ab51d8c3cc26e62",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
