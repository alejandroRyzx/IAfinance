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
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-300 hover:text-white transition duration-300 px-3 py-1 md:px-4 md:py-2 rounded-full border-2 border-purple-600 text-sm md:text-base"
                    >
                      Dashboard
                    </Link>
                  </>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 3H3v6h18V3zM3 9h18v12H3V9zm4 6h10v2H7v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Presupuestos Personalizados
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Crea y gestiona presupuestos adaptados a tus necesidades específicas.
                </p>
              </motion.div>

              {/* Acceso Multiplataforma */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  Acceso Multiplataforma
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Accede a tus finanzas desde cualquier dispositivo, en cualquier momento.
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
              Planes y Precios
            </h2>
            <p className="text-center text-gray-300 mb-8 md:mb-12 max-w-md md:max-w-3xl mx-auto text-sm md:text-base">
              Tu plan gratuito se asigna automáticamente. Aquí puedes actualizar a un plan superior para desbloquear todas las funcionalidades.
            </p>
            {/* Selector de Mensual/Anual */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="flex bg-gray-800 rounded-full p-1">
                <button
                  onClick={() => setPricePlan('monthly')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full transition duration-300 text-sm md:text-base ${pricePlan === 'monthly' ? 'bg-purple-600 text-white' : 'text-gray-300'}`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setPricePlan('annual')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full transition duration-300 text-sm md:text-base ${pricePlan === 'annual' ? 'bg-purple-600 text-white' : 'text-gray-300'}`}
                >
                  Anual
                </button>
              </div>
            </div>
            {/* Tarjetas de Precios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${pricePlan}-free`}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={priceCardAnimation}
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-2">Gratuito</h3>
                  <p className="text-gray-400 mb-4 text-sm md:text-base">
                    Ideal para empezar a gestionar tus finanzas.
                  </p>
                  <p className="text-2xl md:text-3xl font-bold mb-4">
                    $0<span className="text-sm md:text-base">/{pricePlan === 'monthly' ? 'mes' : 'año'}</span>
                  </p>
                  <ul className="text-gray-400 mb-6 space-y-2 text-sm md:text-base">
                    <li>✔ Seguimiento básico de gastos</li>
                    <li>✔ 5 categorías personalizadas</li>
                    <li>✔ Soporte por correo</li>
                  </ul>
                  <button
                    className="px-4 py-2 md:px-6 md:py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                    onClick={() => navigate('/login')}
                  >
                    Comenzar Gratis
                  </button>
                </motion.div>

                <motion.div
                  key={`${pricePlan}-pro`}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg text-center border border-purple-600 relative"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={priceCardAnimation}
                >
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs md:text-sm">
                    Más Popular
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">Pro</h3>
                  <p className="text-gray-400 mb-4 text-sm md:text-base">
                    Perfecto para usuarios avanzados.
                  </p>
                  <p className="text-2xl md:text-3xl font-bold mb-4">
                    {pricePlan === 'monthly' ? '$9.99' : '$99.99'}
                    <span className="text-sm md:text-base">/{pricePlan === 'monthly' ? 'mes' : 'año'}</span>
                  </p>
                  <ul className="text-gray-400 mb-6 space-y-2 text-sm md:text-base">
                    <li>✔ Seguimiento avanzado de gastos</li>
                    <li>✔ Categorías ilimitadas</li>
                    <li>✔ Proyecciones financieras</li>
                    <li>✔ Soporte prioritario</li>
                  </ul>
                  <button
                    className="px-4 py-2 md:px-6 md:py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                    onClick={() => navigate('/login')}
                  >
                    Elegir Pro
                  </button>
                </motion.div>

                <motion.div
                  key={`${pricePlan}-enterprise`}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={priceCardAnimation}
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-2">Enterprise</h3>
                  <p className="text-gray-400 mb-4 text-sm md:text-base">
                    Para equipos y empresas.
                  </p>
                  <p className="text-2xl md:text-3xl font-bold mb-4">
                    {pricePlan === 'monthly' ? '$29.99' : '$299.99'}
                    <span className="text-sm md:text-base">/{pricePlan === 'monthly' ? 'mes' : 'año'}</span>
                  </p>
                  <ul className="text-gray-400 mb-6 space-y-2 text-sm md:text-base">
                    <li>✔ Todo lo del plan Pro</li>
                    <li>✔ Acceso multiusuario</li>
                    <li>✔ Reportes personalizados</li>
                    <li>✔ Soporte 24/7</li>
                  </ul>
                  <button
                    className="px-4 py-2 md:px-6 md:py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                    onClick={() => navigate('/login')}
                  >
                    Elegir Enterprise
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Footer */}
          <footer className="py-8 px-4 bg-gray-800 text-center">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-lg md:text-xl font-semibold mb-4">ExpensIA</h3>
              <p className="text-gray-400 mb-6 text-sm md:text-base">
                Gestiona tus finanzas con inteligencia artificial. Optimiza tus gastos y alcanza tus metas financieras.
              </p>
              <div className="flex justify-center gap-4 mb-6">
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.4 2.86 8.14 6.84 9.46.5.09.68-.22.68-.48v-1.7c-2.78.6-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.92-.62.07-.61.07-.61 1.02.07 1.56 1.05 1.56 1.05.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A9.96 9.96 0 0022 12c0-5.5-4.46-9.96-9.96-9.96z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11 1-.37-.02-2.02-.2-3.82-.98-1.8-.78-3.2-2.06-3.82-3.82-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.55 1.72 2.14 2.97 4.03 3.01-1.48 1.16-3.34 1.85-5.36 1.85-.35 0-.69-.02-1.03-.06 1.91 1.23 4.18 1.94 6.62 1.94 7.94 0 12.29-6.58 12.29-12.29 0-.19 0-.37-.01-.56.84-.6 1.56-1.35 2.14-2.21z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5S8.86 1 7.48 1 4.98 2.12 4.98 3.5zm0 2.5C3.12 6 1.5 7.62 1.5 9.48v11.02c0 1.86 1.62 3.48 3.48 3.48h14.04c1.86 0 3.48-1.62 3.48-3.48V9.48c0-1.86-1.62-3.48-3.48-3.48H4.98zm2.5 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm9.52 0h2.5v7.5h-2.5v-7.5z" />
                  </svg>
                </a>
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} ExpensIA. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;