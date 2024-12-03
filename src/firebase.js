// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv99d0lVHLmjZIZJWOr36XE4oiPB7bUy4",
  authDomain: "lanuzalab2itd112.firebaseapp.com",
  projectId: "lanuzalab2itd112",
  storageBucket: "lanuzalab2itd112.firebasestorage.app",
  messagingSenderId: "821250432778",
  appId: "1:821250432778:web:7f6301b2cf960fa3ab24f3",
  measurementId: "G-W19RWTKK1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
