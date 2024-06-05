// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAuxn2xOERb7hR1od_dK2giDY64GHFi3I",
  authDomain: "proofimaster-d08d2.firebaseapp.com",
  projectId: "proofimaster-d08d2",
  storageBucket: "proofimaster-d08d2.appspot.com",
  messagingSenderId: "130257599664",
  appId: "1:130257599664:web:5f6c97b3a37b8848d78f75",
  measurementId: "G-0ECVZCKF9J"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase);

export default appFirebase;