import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gray-800 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-purple-600">
              FinanceBot
            </span>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Crea tu Cuenta
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Regístrate para empezar a gestionar tus finanzas
        </p>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-center"
            role="alert"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Formulario de Registro */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="tu@correo.com"
              required
              aria-label="Correo Electrónico"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="••••••••"
              required
              aria-label="Contraseña"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="••••••••"
              required
              aria-label="Confirmar Contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600"
            aria-label="Crear Cuenta"
          >
            Crear Cuenta
          </button>
        </form>

        {/* Enlace para Inicio de Sesión */}
        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-600"
            aria-label="Inicia sesión aquí"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;