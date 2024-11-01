// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBILmbwWl0nrPObUIk7SexkNi11cc3NAbE",
  authDomain: "tugas-9c8b0.firebaseapp.com",
  projectId: "tugas-9c8b0",
  storageBucket: "tugas-9c8b0.appspot.com",
  messagingSenderId: "605021529374",
  appId: "1:605021529374:web:e8ddcf913df75d6d67150f",
  measurementId: "G-62Q7741HJ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const initializeFirebase = () => app;
