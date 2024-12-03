// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD35qCjkBDptxSTgEgRhcL6bHZ0FoL2iH4",
  authDomain: "lanuza112lab2.firebaseapp.com",
  projectId: "lanuza112lab2",
  storageBucket: "lanuza112lab2.firebasestorage.app",
  messagingSenderId: "929694436251",
  appId: "1:929694436251:web:894ce264feb76ff38a6f3e",
  measurementId: "G-BQS7T18JTC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
