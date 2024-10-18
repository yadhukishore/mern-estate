// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-6491e.firebaseapp.com",
  projectId: "mern-estate-6491e",
  storageBucket: "mern-estate-6491e.appspot.com",
  messagingSenderId: "412405619550",
  appId: "1:412405619550:web:009f3b6ca4be24badd4dcf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);