import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAuxn2xOERb7hR1od_dK2giDY64GHFi3I",
  authDomain: "proofimaster-d08d2.firebaseapp.com",
  projectId: "proofimaster-d08d2",
  storageBucket: "proofimaster-d08d2.appspot.com",
  messagingSenderId: "130257599664",
  appId: "1:130257599664:web:5f6c97b3a37b8848d78f75",
  measurementId: "G-0ECVZCKF9J"
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(appFirebase);

// Inicializar Google Auth
export const auth = getAuth(appFirebase);
export const googleProvider = new GoogleAuthProvider();

// Inicializar Analytics
const analytics = getAnalytics(appFirebase);

export default appFirebase;
