import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './firebase';
import ErrorBoundary from './ErrorBoundary';
import Aurora from './Aurora';
import PrivateRoute from './components/PrivateRoute';

// Importamos las páginas internas
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Transactions from './pages/Transactions';
import Recurring from './pages/Recurring';
import Categories from './pages/Categories';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal (landing page) */}
        <Route path="/" element={<LandingPage />} />
        {/* Ruta para la página de login */}
        <Route path="/login" element={<Login />} />
        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <Tickets />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />
        <Route
          path="/recurring"
          element={
            <PrivateRoute>
              <Recurring />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Componente de la página principal (Landing Page)
function LandingPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [pricePlan, setPricePlan] = useState('monthly');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Verificar el estado de autenticación
  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth no está inicializado.");
      return;
    }
    console.log("LandingPage: Iniciando verificación de autenticación...");
    try {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        console.log("LandingPage: Estado de usuario actualizado:", currentUser ? currentUser.uid : null);
        setUser(currentUser);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("LandingPage: Error al verificar el estado de autenticación:", error);
    }
  }, []);

  // Configuración de las partículas
  const particlesInit = async (engine) => {
    try {
      await loadSlim(engine);
      console.log("LandingPage: Partículas inicializadas correctamente.");
    } catch (error) {
      console.error("LandingPage: Error al inicializar partículas:", error);
    }
  };

  const particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.5,
        random: true,
      },
      size: {
        value: 3,
        random: true,
      },
      line_linked: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: false,
        },
        onclick: {
          enable: false,
        },
        resize: true,
      },
    },
    retina_detect: true,
  };

  // Manejar el movimiento del cursor para el efecto de luz
  const handleMouseMove = (e, cardId) => {
    if (hoveredCard === cardId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPosition({ x, y });
    }
  };

  // Animaciones de scroll
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Animación para el cambio de precios
  const priceCardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  // Alternar el menú hamburguesa
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  console.log("LandingPage: Renderizando componente...");

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Contenedor para el Header y el Hero con el fondo Aurora */}
        <div className="relative">
          {/* Fondo Aurora con nuevos colores */}
          <div className="absolute inset-0 z-0">
            <ErrorBoundary>
              <Aurora
                colorStops={["#6B48FF", "#00DDEB", "#FF2E63"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
                style={{ height: '100%' }}
              />
            </ErrorBoundary>
          </div>

          {/* Fondo de Partículas */}
          <ErrorBoundary>
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={particlesOptions}
              className="absolute inset-0 z-1"
            />
          </ErrorBoundary>

          {/* Contenido del Header y Hero */}
          <div className="relative z-10">
            {/* Header Completamente Transparente */}
            <motion.header
              className="flex justify-between items-center p-4 md:p-6 bg-transparent z-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {/* Nombre de la App (Logo) */}
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold">ExpensIA</span>
              </div>
              {/* Navegación */}
              <nav className="hidden md:flex gap-4 md:gap-6">
                <ScrollLink
                  to="como-funciona"
                  smooth={true}
                  duration={500}
                  className="text-gray-300 hover:text-white transition duration-300 cursor-pointer text-sm md:text-base"
                >
                  Cómo Funciona
                </ScrollLink>
                <ScrollLink
                  to="caracteristicas"
                  smooth={true}
                  duration={500}
                  className="text-gray-300 hover:text-white transition duration-300 cursor-pointer text-sm md:text-base"
                >
                  Características
                </ScrollLink>
                <ScrollLink
                  to="precios"
                  smooth={true}
                  duration={500}
                  className="text-gray-300 hover:text-white transition duration-300 cursor-pointer text-sm md:text-base"
                >
                  Precios
                </ScrollLink>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition duration-300 px-3 py-1 md:px-4 md:py-2 rounded-full border-2 border-purple-600 text-sm md:text-base"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to="/login"
                      className="text-gray-300 hover:text-white transition duration-300 px-3 py-1 md:px-4 md:py-2 rounded-full border-2 border-purple-600 text-sm md:text-base"
                    >
                      Iniciar Sesión
                    </Link>
                  </motion.div>
                )}
              </nav>
              {/* Botón de Menú Hamburguesa para Móviles */}
              <button className="md:hidden text-gray-300 z-50" onClick={toggleMenu}>
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </motion.header>

            {/* Menú Móvil */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="fixed inset-0 bg-gray-900 z-40 flex flex-col items-center justify-center md:hidden"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <nav className="flex flex-col gap-6 text-center">
                    <ScrollLink
                      to="como-funciona"
                      smooth={true}
                      duration={500}
                      className="text-gray-300 hover:text-white transition duration-300 text-lg"
                      onClick={toggleMenu}
                    >
                      Cómo Funciona
                    </ScrollLink>
                    <ScrollLink
                      to="caracteristicas"
                      smooth={true}
                      duration={500}
                      className="text-gray-300 hover:text-white transition duration-300 text-lg"
                      onClick={toggleMenu}
                    >
                      Características
                    </ScrollLink>
                    <ScrollLink
                      to="precios"
                      smooth={true}
                      duration={500}
                      className="text-gray-300 hover:text-white transition duration-300 text-lg"
                      onClick={toggleMenu}
                    >
                      Precios
                    </ScrollLink>
                    {user ? (
                      <Link
                        to="/dashboard"
                        className="text-gray-300 hover:text-white transition duration-300 px-4 py-2 rounded-full border-2 border-purple-600 text-lg"
                        onClick={toggleMenu}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="text-gray-300 hover:text-white transition duration-300 px-4 py-2 rounded-full border-2 border-purple-600 text-lg"
                        onClick={toggleMenu}
                      >
                        Iniciar Sesión
                      </Link>
                    )}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero Section */}
            <motion.section
              id="como-funciona"
              className="text-center py-12 md:py-20 px-4 relative z-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-400 mb-4 md:mb-6 leading-tight"
                initial={{ filter: 'blur(10px)', opacity: 0 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                Mis Gastos con Inteligencia Artificial
              </motion.h1>
              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-md md:max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Tu asistente financiero personal disponible 24/7. Optimiza tus gastos y alcanza tus metas financieras en un solo lugar.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    filter: 'brightness(1.2)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative inline-block"
                >
                  <Link
                    to="/login"
                    className="relative inline-block px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-lg font-semibold"
                  >
                    {/* Contenedor del fondo animado */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <motion.div
                        className="w-full h-full"
                        style={{
                          background: 'linear-gradient(90deg, #d8b4fe, #9333ea, #d8b4fe)',
                          backgroundSize: '200% 100%',
                        }}
                        animate={{
                          backgroundPosition: ['0% 50%', '200% 50%'],
                        }}
                        transition={{
                          duration: 3,
                          ease: 'linear',
                          repeat: Infinity,
                          repeatType: 'loop',
                        }}
                      />
                    </div>
                    {/* Texto del botón */}
                    <motion.span
                      className="relative z-10 flex items-center gap-2"
                      style={{
                        color: 'white',
                      }}
                    >
                      Comenzar Ahora
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.section>
          </div>
        </div>

        {/* Contenido Principal (sin fondo Aurora) */}
        <div className="relative z-0">
          {/* Características */}
          <motion.section
            id="caracteristicas"
            className="py-12 md:py-16 px-4 relative z-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
              Características Principales
            </h2>
            <p className="text-center text-gray-300 mb-8 md:mb-12 max-w-md md:max-w-3xl mx-auto text-sm md:text-base">
              Descubre todas las herramientas que ExpensIA pone a tu disposición para optimizar tus finanzas de manera inteligente y eficiente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {/* Análisis en Tiempo Real */}
              <motion.div
                className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, 1)}
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
              >
                {hoveredCard === 1 && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                    }}
                  />
                )}
                <div className="text-purple-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Análisis en Tiempo Real
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Monitorea tus gastos al instante y recibe alertas cuando detectamos patrones inusuales.
                </p>
              </motion.div>

              {/* Seguridad Avanzada */}
              <motion.div
                className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, 2)}
                onMouseEnter={() => setHoveredCard(2)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
              >
                {hoveredCard === 2 && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                    }}
                  />
                )}
                <div className="text-purple-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.66 0 3-1.34 3-3S13.66 5 12 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Seguridad Avanzada
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Tus datos financieros están protegidos con encriptación de nivel bancario.
                </p>
              </motion.div>

              {/* Proyecciones Financieras */}
              <motion.div
                className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, 3)}
                onMouseEnter={() => setHoveredCard(3)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
              >
                {hoveredCard === 3 && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                    }}
                  />
                )}
                <div className="text-purple-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v16H4V4z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Proyecciones Financieras
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Visualiza tu futuro financiero con proyecciones basadas en tus hábitos actuales.
                </p>
              </motion.div>

              {/* Categorización Inteligente */}
              <motion.div
                className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, 4)}
                onMouseEnter={() => setHoveredCard(4)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
              >
                {hoveredCard === 4 && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                    }}
                  />
                )}
                <div className="text-purple-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Categorización Inteligente
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Nuestro sistema de IA clasifica automáticamente tus transacciones con precisión.
                </p>
              </motion.div>

              {/* Presupuestos Personalizados */}
              <motion.div
                className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, 5)}
                onMouseEnter={() => setHoveredCard(5)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
              >
                {hoveredCard === 5 && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                    }}
                  />
                )}
                <div className="text-purple-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2zm0-4c-2.76 0-5 2.24-5 5v4c0 2.76 2.24 5 5 5s5-2.24 5-5v-4c0-2.76-2.24-5-5-5z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Presupuestos Personalizados
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Crea presupuestos adaptados a tus necesidades y recibe recomendaciones personalizadas.
                </p>
              </motion.div>

              {/* Soporte 24/7 */}
              <motion.div
                className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
                onMouseMove={(e) => handleMouseMove(e, 6)}
                onMouseEnter={() => setHoveredCard(6)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
              >
                {hoveredCard === 6 && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                    }}
                  />
                )}
                <div className="text-purple-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M3 10h18M3 15h18M3 20h18" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Soporte 24/7
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Nuestro equipo de soporte está disponible en cualquier momento para ayudarte.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Precios */}
          <motion.section
            id="precios"
            className="py-12 md:py-16 px-4 relative z-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
              Planes de Precios
            </h2>
            <p className="text-center text-gray-300 mb-8 md:mb-12 max-w-md md:max-w-3xl mx-auto text-sm md:text-base">
              Elige el plan que mejor se adapte a tus necesidades y comienza a optimizar tus finanzas hoy mismo.
            </p>
            {/* Toggle para cambiar entre mensual y anual */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-800 rounded-full p-1">
                <button
                  onClick={() => setPricePlan('monthly')}
                  className={`px-4 py-2 rounded-full text-sm md:text-base transition duration-300 ${
                    pricePlan === 'monthly' ? 'bg-purple-600 text-white' : 'text-gray-300'
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setPricePlan('annual')}
                  className={`px-4 py-2 rounded-full text-sm md:text-base transition duration-300 ${
                    pricePlan === 'annual' ? 'bg-purple-600 text-white' : 'text-gray-300'
                  }`}
                >
                  Anual
                </button>
              </div>
            </div>
            {/* Planes de Precios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                {pricePlan === 'monthly' ? (
                  <motion.div
                    key="monthly"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={priceCardAnimation}
                  >
                    {/* Plan Básico Mensual */}
                    <motion.div
                      className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-4">Básico</h3>
                      <p className="text-2xl md:text-3xl font-bold mb-4">$9.99 <span className="text-sm md:text-base text-gray-400">/mes</span></p>
                      <ul className="text-gray-400 text-sm md:text-base mb-6 space-y-2">
                        <li>Análisis básico de gastos</li>
                        <li>Categorización automática</li>
                        <li>Soporte por correo</li>
                      </ul>
                      <Link
                        to="/login"
                        className="inline-block px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                      >
                        Elegir Plan
                      </Link>
                    </motion.div>
                    {/* Plan Pro Mensual */}
                    <motion.div
                      className="bg-gray-800 p-6 rounded-lg shadow-lg text-center border border-purple-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-4">Pro</h3>
                      <p className="text-2xl md:text-3xl font-bold mb-4">$19.99 <span className="text-sm md:text-base text-gray-400">/mes</span></p>
                      <ul className="text-gray-400 text-sm md:text-base mb-6 space-y-2">
                        <li>Análisis avanzado de gastos</li>
                        <li>Proyecciones financieras</li>
                        <li>Soporte prioritario 24/7</li>
                      </ul>
                      <Link
                        to="/login"
                        className="inline-block px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                      >
                        Elegir Plan
                      </Link>
                    </motion.div>
                    {/* Plan Premium Mensual */}
                    <motion.div
                      className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-4">Premium</h3>
                      <p className="text-2xl md:text-3xl font-bold mb-4">$29.99 <span className="text-sm md:text-base text-gray-400">/mes</span></p>
                      <ul className="text-gray-400 text-sm md:text-base mb-6 space-y-2">
                        <li>Todas las funciones Pro</li>
                        <li>Integraciones avanzadas</li>
                        <li>Asesor financiero personal</li>
                      </ul>
                      <Link
                        to="/login"
                        className="inline-block px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                      >
                        Elegir Plan
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="annual"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={priceCardAnimation}
                  >
                    {/* Plan Básico Anual */}
                    <motion.div
                      className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-4">Básico</h3>
                      <p className="text-2xl md:text-3xl font-bold mb-4">$99.99 <span className="text-sm md:text-base text-gray-400">/año</span></p>
                      <p className="text-gray-400 text-sm mb-4">Ahorra 20%</p>
                      <ul className="text-gray-400 text-sm md:text-base mb-6 space-y-2">
                        <li>Análisis básico de gastos</li>
                        <li>Categorización automática</li>
                        <li>Soporte por correo</li>
                      </ul>
                      <Link
                        to="/login"
                        className="inline-block px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                      >
                        Elegir Plan
                      </Link>
                    </motion.div>
                    {/* Plan Pro Anual */}
                    <motion.div
                      className="bg-gray-800 p-6 rounded-lg shadow-lg text-center border border-purple-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-4">Pro</h3>
                      <p className="text-2xl md:text-3xl font-bold mb-4">$199.99 <span className="text-sm md:text-base text-gray-400">/año</span></p>
                      <p className="text-gray-400 text-sm mb-4">Ahorra 20%</p>
                      <ul className="text-gray-400 text-sm md:text-base mb-6 space-y-2">
                        <li>Análisis avanzado de gastos</li>
                        <li>Proyecciones financieras</li>
                        <li>Soporte prioritario 24/7</li>
                      </ul>
                      <Link
                        to="/login"
                        className="inline-block px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                      >
                        Elegir Plan
                      </Link>
                    </motion.div>
                    {/* Plan Premium Anual */}
                    <motion.div
                      className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-4">Premium</h3>
                      <p className="text-2xl md:text-3xl font-bold mb-4">$299.99 <span className="text-sm md:text-base text-gray-400">/año</span></p>
                      <p className="text-gray-400 text-sm mb-4">Ahorra 20%</p>
                      <ul className="text-gray-400 text-sm md:text-base mb-6 space-y-2">
                        <li>Todas las funciones Pro</li>
                        <li>Integraciones avanzadas</li>
                        <li>Asesor financiero personal</li>
                      </ul>
                      <Link
                        to="/login"
                        className="inline-block px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                      >
                        Elegir Plan
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Footer */}
          <motion.footer
            className="bg-gray-800 py-8 px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">ExpensIA</h3>
                <p className="text-gray-400 text-sm">
                  Tu asistente financiero personal para optimizar tus gastos y alcanzar tus metas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>
                    <ScrollLink
                      to="como-funciona"
                      smooth={true}
                      duration={500}
                      className="hover:text-white transition duration-300 cursor-pointer"
                    >
                      Cómo Funciona
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="caracteristicas"
                      smooth={true}
                      duration={500}
                      className="hover:text-white transition duration-300 cursor-pointer"
                    >
                      Características
                    </ScrollLink>
                  </li>
                  <li>
                    <ScrollLink
                      to="precios"
                      smooth={true}
                      duration={500}
                      className="hover:text-white transition duration-300 cursor-pointer"
                    >
                      Precios
                    </ScrollLink>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-white transition duration-300">
                      Iniciar Sesión
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                <p className="text-gray-400 text-sm">
                  Email: soporte@expensia.com
                </p>
                <p className="text-gray-400 text-sm">
                  Teléfono: +1 234 567 890
                </p>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.56c-.89.39-1.84.65-2.83.77 1.02-.61 1.8-1.58 2.17-2.73-.95.56-2 .97-3.12 1.19-.9-.96-2.18-1.56-3.6-1.56-2.72 0-4.93 2.21-4.93 4.93 0 .39.04.77.13 1.13-4.1-.21-7.74-2.17-10.18-5.15-.43.73-.67 1.58-.67 2.49 0 1.72.87 3.23 2.2 4.12-.81-.03-1.57-.25-2.24-.62v.06c0 2.4 1.71 4.4 3.98 4.85-.42.11-.86.17-1.31.17-.32 0-.63-.03-.94-.09.63 1.97 2.46 3.41 4.63 3.45-1.7 1.33-3.83 2.12-6.15 2.12-.4 0-.79-.02-1.18-.07 2.18 1.4 4.77 2.22 7.55 2.22 9.05 0 14-7.5 14-14 0-.21 0-.42-.01-.63.96-.69 1.8-1.56 2.46-2.55z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.04c-5.52 0-9.96 4.48-9.96 10 0 4.42 2.88 8.14 6.84 9.44.5.09.68-.22.68-.48v-1.7c-2.78.6-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.92-.62.07-.61.07-.61 1.02.07 1.56 1.05 1.56 1.05.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.56.82.56 1.65v2.45c0 .27.18.58.69.48A10.01 10.01 0 0022 12.04c0-5.52-4.44-10-9.96-10z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.72 2.14 2.97 4.03 3.01-1.47 1.15-3.32 1.84-5.33 1.84-.35 0-.69-.02-1.03-.06 1.89 1.22 4.14 1.93 6.55 1.93 7.86 0 12.15-6.52 12.15-12.18 0-.19 0-.37-.01-.55.83-.6 1.55-1.35 2.12-2.21z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} ExpensIA. Todos los derechos reservados.</p>
            </div>
          </motion.footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;