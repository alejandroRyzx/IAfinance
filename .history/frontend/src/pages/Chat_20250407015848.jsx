import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mensaje de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "¡Bienvenido a tu asistente financiero!\n\nHe configurado algunas categorías predeterminadas para que puedas empezar a gestionar tus finanzas de inmediato.\n\n⭐ ¿Qué puedo hacer por ti?\n\n- Registrar tus gastos e ingresos en diferentes categorías\n- Analizar tus movimientos financieros\n- Procesar fotos de tickets/facturas automáticamente\n- Consultar tu presupuesto y balance\n\n¿En qué puedo ayudarte hoy?",
        },
      ]);
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages([...messages, { sender: "user", text: message }]);
    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Estoy procesando tu mensaje... ¿En qué puedo ayudarte hoy?" },
      ]);
    }, 1000);
  };

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={scrollReveal}
    >
      <Sidebar />

      <div className="flex-1 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-8rem)] flex flex-col">
          {/* Cuerpo del Chat */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  } whitespace-pre-line`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t flex items-center gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enviar mensaje..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              aria-label="Escribe un mensaje"
            />
            <button
              type="submit"
              className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Enviar mensaje"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;