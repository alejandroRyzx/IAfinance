// src/pages/Register.jsx
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importar framer-motion

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Definir la animación fadeInUp
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGitHubRegister = async () => {
    setError('Registro con GitHub no está implementado aún.');
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={fadeInUp} // Aplicar la animación
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
          Regístrate
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Crea una cuenta con GitHub o Google
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Botones de Registro con GitHub y Google */}
        <div className="space-y-3">
          <button
            onClick={handleGitHubRegister}
            className="group w-full flex items-center justify-center gap-2 bg-gray-800 text-white p-3 rounded-lg transition-all duration-300 hover:bg-gray-900 hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
            </svg>
            Registrarse con GitHub
          </button>
          <button
            onClick={handleGoogleRegister}
            className="group w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-600 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.04.69-2.37 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.62 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.62 1 4.01 3.48 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Registrarse con Google
          </button>
        </div>

        {/* Separador */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-600">O continúa con</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Formulario de Registro */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300 hover:border-purple-400 hover:shadow-md"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300 hover:border-purple-400 hover:shadow-md"
              placeholder=""
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
          >
            Registrarse
          </button>
        </form>

        {/* Enlace para Iniciar Sesión */}
        <p className="text-center text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="relative text-purple-600 transition-all duration-300 hover:text-purple-800"
          >
            Inicia sesión
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-purple-600 transition-all duration-300 hover:w-full"></span>
          </Link>
        </p>

        {/* Términos y Condiciones */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Al hacer clic en continuar, aceptas nuestros{' '}
          <a
            href="/terminos-condiciones"
            className="relative text-purple-600 transition-all duration-300 hover:text-purple-800"
          >
            Términos de Servicio
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-purple-600 transition-all duration-300 hover:w-full"></span>
          </a>{' '}
          y{' '}
          <a
            href="/politica-privacidad"
            className="relative text-purple-600 transition-all duration-300 hover:text-purple-800"
          >
            Política de Privacidad
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-purple-600 transition-all duration-300 hover:w-full"></span>
          </a>.
        </p>

        {/* Enlace para Volver al Inicio */}
        <p className="text-center text-gray-600 mt-4">
          <Link
            to="/"
            className="relative text-purple-600 transition-all duration-300 hover:text-purple-800"
          >
            Volver al inicio
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-purple-600 transition-all duration-300 hover:w-full"></span>
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Register;