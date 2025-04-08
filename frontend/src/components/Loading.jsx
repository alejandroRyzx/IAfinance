import { motion } from "framer-motion";

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        className="w-16 h-16 border-4 border-t-transparent border-purple-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default Loading;