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
    query,
    orderBy,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// Configuração do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDCqAkO1L5935U1E2a2PW5HkpZJy0Gauwc",
    authDomain: "derchamados.firebaseapp.com",
    projectId: "derchamados",
    storageBucket: "derchamados.firebasestorage.app",
    messagingSenderId: "922256232360",
    appId: "1:922256232360:web:a0492c02fcbbf6a7dd579d",
    measurementId: "G-0BNGCJ6NSH"
};


// Inicialização do Firebase e Banco de Dados
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================================
// FUNÇÃO: CRIAR OCORRÊNCIA (motorista.html)
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
                status: "nova",
                operador: "",
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


// ==========================================
// FUNÇÃO: ESCUTAR OCORRÊNCIAS EM TEMPO REAL
// (operador.html / painel.html)
// ==========================================
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


// ==========================================
// FUNÇÃO: ALTERAR STATUS
// (operador.html / painel.html)
// ==========================================
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
