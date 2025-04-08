import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ErrorBoundary from "../ErrorBoundary";

const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Categories = () => {
  const [chatCount, setChatCount] = useState(0);

  console.log("Categories: Renderizando componente...");

  const handleNewChat = () => {
    setChatCount((prev) => prev + 1);
    console.log("Categories: Nuevo chat iniciado, conteo:", chatCount + 1);
  };

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={scrollReveal}
    >
      <ErrorBoundary>
        <Sidebar onNewChat={handleNewChat} />
      </ErrorBoundary>
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Categorías</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Lista de Categorías
          </h2>
          <p className="text-gray-600">
            Aquí puedes gestionar tus categorías financieras.
          </p>
          <p className="text-gray-600 mt-2">
            Número de chats iniciados: {chatCount}
          </p>
        </div>
      </main>
    </motion.div>
  );
};

export default Categories;