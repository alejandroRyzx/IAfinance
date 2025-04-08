import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "../components/Loading";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/dashboard");
        }, 1000);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    const provider = new GithubAuthProvider();
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="w-full max-w-md p-8">
        {/* Logo con efecto de hover */}
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
          Bienvenido de vuelta
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Inicia sesión con tu cuenta de GitHub o Google
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

        {/* Botones de Inicio de Sesión con GitHub y Google */}
        <div className="space-y-3">
          <button
            onClick={handleGitHubLogin}
            className="group w-full flex items-center justify-center gap-2 bg-gray-800 text-white p-3 rounded-lg transition-all duration-300 hover:bg-gray-900 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            aria-label="Iniciar sesión con GitHub"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
          <button
            onClick={handleGoogleLogin}
            className="group w-full flex items-center justify-center gap-2 bg-white text-gray-800 p-3 rounded-lg border border-gray-300 transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Iniciar sesión con Google"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.5h5.88c-.25 1.31-.97 2.41-2.06 3.15v2.61h3.34c1.95-1.79 3.08-4.42 3.08-7.51z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.34-2.61c-1.02.69-2.31 1.1-3.94 1.1-3.03 0-5.6-2.05-6.52-4.81H2.1v2.69C3.92 20.46 7.73 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.48 14.36c-.24-.69-.38-1.43-.38-2.19s.14-1.5.38-2.19V7.29H2.1C1.39 8.77 1 10.36 1 12s.39 3.23 1.1 4.71l3.38-2.35z"
              />
              <path
                fill="#EA4335"
                d="M12 4.54c1.63 0 3.09.56 4.24 1.66l3.17-3.17C17.46 1.01 14.97 0 12 0 7.73 0 3.92 2.54 2.1 6.36l3.38 2.35C6.4 6.95 8.97 4.54 12 4.54z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Separador */}
        <div className="flex items-center justify-between my-6">
          <hr className="w-full border-gray-300" />
          <span className="px-3 text-gray-500">o</span>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Formulario de Inicio de Sesión con Correo */}
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600"
            aria-label="Iniciar Sesión"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace para Registro */}
        <p className="text-center text-gray-600 mt-6">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-600"
            aria-label="Regístrate aquí"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;