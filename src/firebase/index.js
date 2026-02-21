import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyA8eoQPyEy232O76ZDfbpW-G1Xos-NsXaM",
  authDomain: "nangurasocialcare.org",
  projectId: "nangurasocialcare",
  storageBucket: "nangurasocialcare.firebasestorage.app",
  messagingSenderId: "911240338406",
  appId: "1:911240338406:web:7974bc834245f5feb95427",
  measurementId: "G-KC2VEK121H"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { storage, db, auth, functions };
