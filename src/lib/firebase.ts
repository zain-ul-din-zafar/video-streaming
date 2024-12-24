// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqE11KWyz2e13y0jqHK1Y8X70TzpkzldU",
  authDomain: "test-app-6e3c8.firebaseapp.com",
  projectId: "test-app-6e3c8",
  storageBucket: "test-app-6e3c8.firebasestorage.app",
  messagingSenderId: "385032331288",
  appId: "1:385032331288:web:bda5e1b6c543ebb703636d"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore();
export const fireAuth = getAuth(firebaseApp);

// collections
export const collections = {
  playlists: "playlists"
};
