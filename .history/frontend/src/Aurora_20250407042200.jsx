// src/Aurora.jsx
import { motion } from "framer-motion";

const Aurora = ({ colorStops = ["#6B48FF", "#00DDEB", "#FF2E63"], blend = 0.5, amplitude = 1.0, speed = 0.5, style = {} }) => {
  return (
    <motion.div
      className="aurora"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: `linear-gradient(45deg, ${colorStops.join(", ")})`,
        opacity: blend,
        filter: "blur(50px)",
        ...style,
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%"],
      }}
      transition={{
        duration: speed * 10,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
    />
  );
};

export default Aurora;