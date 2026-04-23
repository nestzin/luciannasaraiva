import { db } from "./lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function validarCodigoConvite(codigo: string) {
  try {
    const codigoLimpo = codigo.trim().toUpperCase();
    const q = query(
      collection(db, "convites"), 
      where("codigo", "==", codigoLimpo), 
      where("usado", "==", false)
    );
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { sucesso: false, erro: "Código inválido ou já utilizado." };
    }

    return { sucesso: true, conviteId: querySnapshot.docs[0].id };
  } catch (e) {
    console.error("Erro na validação:", e);
    return { sucesso: false, erro: "Erro de ligação ao banco de dados." };
  }
}