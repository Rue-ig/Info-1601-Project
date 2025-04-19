// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPSvd3eSehMj1hWx1r6chTikcia156qWM",
  authDomain: "island-friends.firebaseapp.com",
  projectId: "island-friends",
  storageBucket: "island-friends.firebasestorage.app",
  messagingSenderId: "421315825733",
  appId: "1:421315825733:web:08d018d67563a8950fd32c",
  measurementId: "G-B9375ZPSQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);