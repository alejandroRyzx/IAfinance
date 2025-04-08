
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
  // Reemplaza con tus credenciales de Firebase
    apiKey: "AIzaSyAuf1ngh3x1K6oXqIf9wQgkEcgL2i0MJ1I",
  authDomain: "fingenie-73f1b.firebaseapp.com",
  projectId: "fingenie-73f1b",
  storageBucket: "fingenie-73f1b.firebasestorage.app",
  messagingSenderId: "575080858200",
  appId: "1:575080858200:web:16c7a48de516895687802d",
  measurementId: "G-L4NV8H8D4M"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar las instancias
export { auth, db };
