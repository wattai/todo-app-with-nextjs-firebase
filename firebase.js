// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKuEMyJrKRE0jtubQoYtY71TTh-AuPJaQ",
  authDomain: "todo-app-nextjs-5548b.firebaseapp.com",
  projectId: "todo-app-nextjs-5548b",
  storageBucket: "todo-app-nextjs-5548b.appspot.com",
  messagingSenderId: "345482017863",
  appId: "1:345482017863:web:9650485e9049c4ec770562",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// eslint-disable-next-line import/prefer-default-export
export { db, auth, provider };
