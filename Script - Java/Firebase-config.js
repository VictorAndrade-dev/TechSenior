import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCwqEeNUDbOSzkeuBesrel7rJkFnsrClh0",
  authDomain: "tech-senior.firebaseapp.com",
  projectId: "tech-senior",
  storageBucket: "tech-senior.firebasestorage.app",
  messagingSenderId: "831487636145",
  appId: "1:831487636145:web:8877e11f5cd28a04bee890",
  measurementId: "G-S78QGL3KS1"
};


export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);


console.log("🔥 Firebase conectado!");