import { initializeApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCtxXNafQclyekTdAs8gzfnqkcCIqpZnhY",
    authDomain: "todoapp-bad4f.firebaseapp.com",
    projectId: "todoapp-bad4f",
    storageBucket: "todoapp-bad4f.firebasestorage.app",
    messagingSenderId: "646949588673",
    appId: "1:646949588673:web:729c3740a4284fa5c88e40",
    measurementId: "G-TD4HQDBMQH"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

const reactNativePersistence = (firebaseAuth ).getReactNativePersistence;

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
    persistence: reactNativePersistence(AsyncStorage),  // Use AsyncStorage for persistence
});
const db=getFirestore(app)
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut ,db};