import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));

const server = app.listen(5001, () => {
  console.log('Server running on port 5001');
});

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAuf1ngh3x1K6oXqIf9wQgkEcgL2i0MJ1I",
    authDomain: "fingenie-73f1b.firebaseapp.com",
    projectId: "fingenie-73f1b",
    storageBucket: "fingenie-73f1b.firebasestorage.app",
    messagingSenderId: "575080858200",
    appId: "1:575080858200:web:16c7a48de516895687802d",
    measurementId: "G-L4NV8H8D4M"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  const unsubscribe = onSnapshot(collection(db, 'expenses'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const expense = change.doc.data();
        if (parseFloat(expense.amount) > 100) {
          io.emit('highExpenseAlert', `Alerta: Nuevo gasto alto detectado - ${expense.description}: $${expense.amount}`);
        }
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    unsubscribe();
  });
});

server.listen(5001, () => {
  console.log('Backend corriendo en http://localhost:5001');
});