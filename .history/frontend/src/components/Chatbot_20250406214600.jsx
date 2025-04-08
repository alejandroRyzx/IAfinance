// src/components/Chatbot.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = ({ isOpen, onClose, messages, setMessages }) => {
  const [message, setMessage] = useState('');

  // Inicializamos los mensajes con el mensaje de bienvenida si no hay mensajes
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: '¡Bienvenido a tu asistente financiero! He configurado algunas categorías predeterminadas para que puedas empezar a gestionar tus finanzas de inmediato. ¿Qué puedo hacer por ti?',
        },
      ]);
    }
  }, [messages, setMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Añadir mensaje del usuario
    setMessages([...messages, { sender: 'user', text: message }]);
    setMessage('');

    // Simular respuesta del bot (puedes integrar aquí una API real)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Estoy procesando tu mensaje... ¿En qué puedo ayudarte hoy?' },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Botón Flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => onClose(true)} // Abre el chatbot
            className="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ventana del Chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Encabezado del Chatbot */}
            <div className="flex justify-between items-center p-4 bg-purple-600 text-white rounded-t-lg">
              <h3 className="text-lg font-semibold">Chatbot</h3>
              <button onClick={() => onClose(false)} className="text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cuerpo del Chat */}
            <div className="p-4 h-64 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === 'user' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Formulario de Entrada */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;