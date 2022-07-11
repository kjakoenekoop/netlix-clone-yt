// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {getAuth} from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4hqxCOWSRi02Cf5Tj6J4eqzDiGXqRHzQ",
    authDomain: "netflix-clone-tutorial-dbc6a.firebaseapp.com",
    projectId: "netflix-clone-tutorial-dbc6a",
    storageBucket: "netflix-clone-tutorial-dbc6a.appspot.com",
    messagingSenderId: "1072636520129",
    appId: "1:1072636520129:web:deb951d7670542dd3c1640",
    measurementId: "G-S0C35FR661"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export {auth, db}