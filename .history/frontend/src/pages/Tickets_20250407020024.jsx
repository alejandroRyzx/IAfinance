import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Tickets = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  console.log("Tickets: Renderizando componente...");

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={scrollReveal}
    >
      <Sidebar />

      <div className="flex-1 p-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Tickets y Facturas
          </h1>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Lista de Tickets
          </h2>
          <p className="text-gray-600">
            Aquí puedes gestionar tus tickets y facturas.
          </p>
        </div>
      </div>

      <Chatbot
        isOpen={isChatbotOpen}
        onClose={setIsChatbotOpen}
        messages={chatMessages}
        setMessages={setChatMessages}
      />
    </motion.div>
  );
};

export default Tickets;