// ==========================================
// FIREBASE
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
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// CONFIGURAÇÃO DO SEU FIREBASE
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDCqAkO1L5935U1E2a2PW5HkpZJy0Gauwc",

    authDomain: "derchamados.firebaseapp.com",

    projectId: "derchamados",

    storageBucket: "derchamados.firebasestorage.app",

    messagingSenderId: "922256232360",

    appId: "1:922256232360:web:a0492c02fcbbf6a7dd579d",

    measurementId: "G-0BNGCJ6NSH"

};


// ==========================================
// INICIALIZAR FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// INICIALIZAR FIRESTORE
// ==========================================

const db = getFirestore(app);


// ==========================================
// CRIAR OCORRÊNCIA
// Usado pelo motorista.html
// ==========================================

export async function criarOcorrencia(dados) {

    const referencia = await addDoc(

        collection(db, "ocorrencias"),

        {

            nome: dados.nome || "",

            placa: dados.placa || "",

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

}


// ==========================================
// ESCUTAR OCORRÊNCIAS
// Usado pelo painel.html
// ==========================================

export function escutarOcorrencias(callback) {

    return onSnapshot(

        collection(db, "ocorrencias"),

        function(snapshot) {

            const ocorrencias = [];


            snapshot.forEach(

                function(item) {

                    ocorrencias.push({

                        id: item.id,

                        ...item.data()

                    });

                }

            );


            // Mais recentes primeiro

            ocorrencias.reverse();


            callback(ocorrencias);

        },

        function(erro) {

            console.error(
                "Erro ao ler ocorrências:",
                erro
            );

        }

    );

}


// ==========================================
// ALTERAR STATUS
// Usado pelo painel.html
// ==========================================

export async function alterarStatus(

    id,

    status,

    operador = ""

) {


    await updateDoc(

        doc(db, "ocorrencias", id),

        {

            status: status,

            operador: operador,

            atualizadoEm: serverTimestamp()

        }

    );

}
