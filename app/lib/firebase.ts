import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACT8AHcNHJYEhNmZTd8EPhW17fIF5Pql0",
  authDomain: "lucianna-saraiva.firebaseapp.com",
  projectId: "lucianna-saraiva",
  storageBucket: "lucianna-saraiva.firebasestorage.app",
  messagingSenderId: "740511941494",
  appId: "1:740511941494:web:3f32a351d0a1236ffc3057",
  measurementId: "G-LJ3R584N29"
};


// Inicializa o Firebase apenas uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);