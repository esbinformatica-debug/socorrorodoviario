// ==========================================
// FIREBASE & FIRESTORE CONFIG
// ==========================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDCqAkO1L5935U1E2a2PW5HkpZJy0Gauwc",
    authDomain: "derchamados.firebaseapp.com",
    projectId: "derchamados",
    storageBucket: "derchamados.firebasestorage.app",
    messagingSenderId: "922256232360",
    appId: "1:922256232360:web:a0492c02fcbbf6a7dd579d",
    measurementId: "G-0BNGCJ6NSH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ==========================================
// FUNÇÕES DE OCORRÊNCIAS
// ==========================================

export async function criarOcorrencia(dados) {
    try {
        const referencia = await addDoc(
            collection(db, "ocorrencias"),
            {
                nome: dados.nome || "",
                placa: dados.placa || "",
                modelo: dados.modelo || "",
                ocupantes: dados.ocupantes || "",
                telefone: dados.telefone || "",
                rodovia: dados.rodovia || "",
                sentido: dados.sentido || "",
                problema: dados.problema || "",
                latitude: dados.latitude ?? null,
                longitude: dados.longitude ?? null,
                status: dados.status || "nova",
                operador: dados.operador || "",
                criadoEm: serverTimestamp(),
                atualizadoEm: serverTimestamp()
            }
        );
        return referencia.id;
    } catch (erro) {
        console.error("Erro ao registrar ocorrência:", erro);
        throw erro;
    }
}

export function escutarOcorrencias(callback) {
    const q = query(
        collection(db, "ocorrencias"),
        orderBy("criadoEm", "desc")
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const ocorrencias = [];
            snapshot.forEach((item) => {
                ocorrencias.push({
                    id: item.id,
                    ...item.data()
                });
            });
            callback(ocorrencias);
        },
        (erro) => {
            console.error("Erro no listener de ocorrências:", erro);
        }
    );
}

export async function alterarStatus(id, status, operador = "") {
    try {
        await updateDoc(
            doc(db, "ocorrencias", id),
            {
                status: status,
                operador: operador,
                atualizadoEm: serverTimestamp()
            }
        );
    } catch (erro) {
        console.error("Erro ao alterar status:", erro);
        throw erro;
    }
}

// ==========================================
// FUNÇÕES EXCLUSIVAS DO ADMIN (CRUD)
// ==========================================

export async function atualizarOcorrencia(id, dados) {
    try {
        await updateDoc(doc(db, "ocorrencias", id), {
            ...dados,
            atualizadoEm: serverTimestamp()
        });
    } catch (erro) {
        console.error("Erro ao atualizar ocorrência:", erro);
        throw erro;
    }
}

export async function excluirOcorrencia(id) {
    try {
        await deleteDoc(doc(doc(db, "ocorrencias", id)));
    } catch (erro) {
        console.error("Erro ao excluir ocorrência:", erro);
        throw erro;
    }
}