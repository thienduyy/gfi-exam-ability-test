// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuOkG8e3nxO1XhhziC5APP_02uNHIi0b0",
  authDomain: "gfi-ability-test.firebaseapp.com",
  projectId: "gfi-ability-test",
  storageBucket: "gfi-ability-test.appspot.com",
  messagingSenderId: "693522352207",
  appId: "1:693522352207:web:9b89cb794003349557823a",
  measurementId: "G-XMSPV5ZBFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line 
// const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);