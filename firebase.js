import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    doc, 
    updateDoc, 
    serverTimestamp, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Salvar novo chamado (Motorista)
export async function salvarOcorrencia(dados) {
    try {
        const docRef = await addDoc(collection(db, "ocorrencias"), {
            ...dados,
            status: "nova",
            criadoEm: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Erro ao salvar ocorrência: ", e);
        throw e;
    }
}

// Escutar ocorrências em tempo real (Painel / Operador)
export function escutarOcorrencias(callback) {
    const q = query(collection(db, "ocorrencias"), orderBy("criadoEm", "desc"));
    return onSnapshot(q, (snapshot) => {
        const ocorrencias = [];
        snapshot.forEach((doc) => {
            ocorrencias.push({ id: doc.id, ...doc.data() });
        });
        callback(ocorrencias);
    });
}

// Alterar Status da Ocorrência
export async function alterarStatus(id, novoStatus, alteradoPor = "Sistema") {
    try {
        const ref = doc(db, "ocorrencias", id);
        await updateDoc(ref, {
            status: novoStatus,
            atualizadoEm: serverTimestamp(),
            atualizadoPor: alteradoPor
        });
    } catch (e) {
        console.error("Erro ao atualizar status: ", e);
        throw e;
    }
}

// Atribuir Guincho/Socorro à Ocorrência
export async function atribuirGuincho(idOcorrencia, dadosGuincho) {
    try {
        const ref = doc(db, "ocorrencias", idOcorrencia);
        await updateDoc(ref, {
            guincho: dadosGuincho,
            status: "socorro",
            atribuidoEm: serverTimestamp()
        });
    } catch (e) {
        console.error("Erro ao atribuir guincho: ", e);
        throw e;
    }
}