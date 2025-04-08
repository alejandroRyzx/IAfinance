// src/pages/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Chat = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={scrollReveal}
    >
      <Sidebar />

      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Chat</h1>
        <Chatbot
          isOpen={isChatbotOpen}
          onClose={setIsChatbotOpen}
          messages={messages}
          setMessages={setMessages}
        />
        <div ref={chatEndRef} />
      </div>
    </motion.div>
  );
};

export default Chat;