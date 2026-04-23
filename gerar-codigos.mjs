import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Cole aqui o seu objeto firebaseConfig do arquivo lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyACT8AHcNHJYEhNmZTd8EPhW17fIF5Pql0",
  authDomain: "lucianna-saraiva.firebaseapp.com",
  projectId: "lucianna-saraiva",
  storageBucket: "lucianna-saraiva.firebasestorage.app",
  messagingSenderId: "740511941494",
  appId: "1:740511941494:web:3f32a351d0a1236ffc3057",
  measurementId: "G-LJ3R584N29"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const gerarPadrao = () => {
  const nums = Math.random().toString().slice(2, 11); // 9 números
  const letras = Math.random().toString(36).replace(/[^a-z]/g, '').slice(0, 3).toUpperCase(); // 3 letras
  return `NUTRI-${nums}-${letras}`;
};

async function popularBanco() {
  console.log("🚀 Gerando códigos...");
  for (let i = 0; i < 20; i++) {
    const novoCodigo = gerarPadrao();
    await addDoc(collection(db, "convites"), {
      codigo: novoCodigo,
      usado: false,
      criado_em: serverTimestamp()
    });
    console.log(`✅ Gerado: ${novoCodigo}`);
  }
  console.log("✨ Pronto! 20 códigos salvos no Firestore.");
  process.exit();
}

popularBanco();