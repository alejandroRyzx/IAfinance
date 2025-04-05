// src/App.jsx
import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './ErrorBoundary';
import Aurora from './Aurora';

function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [pricePlan, setPricePlan] = useState('monthly');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Configuración de las partículas
  const particlesInit = async (engine) => {
    await loadSlim(engine);
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

  return (
    <ErrorBoundary>
      <AnimatePresence>
        <Routes>
          {/* Ruta para la página principal */}
          <Route
            path="/"
            element={
              <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
                {/* Contenedor para el Header y el Hero con el fondo Aurora */}
                <div className="relative">
                  {/* Fondo Aurora con nuevos colores */}
                  <div className="absolute inset-0 z-0">
                    <Aurora
                      colorStops={["#6B48FF", "#00DDEB", "#FF2E63"]}
                      blend={0.5}
                      amplitude={1.0}
                      speed={0.5}
                      style={{ height: '100%' }}
                    />
                  </div>

                  {/* Fondo de Partículas */}
                  <Particles
                    id="tsparticles"
                    init={particlesInit}
                    options={particlesOptions}
                    className="absolute inset-0 z-1"
                  />

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
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pricePlan}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={priceCardAnimation}
                        className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-4xl mx-auto"
                      >
                        {/* Plan Premium */}
                        <motion.div
                          className="relative bg-gray-800 p-6 rounded-lg shadow-md flex-1 overflow-visible"
                          onMouseMove={(e) => handleMouseMove(e, 7)}
                          onMouseEnter={() => setHoveredCard(7)}
                          onMouseLeave={() => setHoveredCard(null)}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          {hoveredCard === 7 && (
                            <div
                              className="absolute inset-0 pointer-events-none rounded-lg"
                              style={{
                                background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                              }}
                            />
                          )}
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {pricePlan === 'monthly' ? 'Mensual Premium' : 'Anual Premium'}
                          </h3>
                          <p className="text-2xl md:text-3xl font-bold mb-4">
                            {pricePlan === 'monthly' ? '$4.99' : '$49.90'}{' '}
                            <span className="text-base md:text-lg font-normal text-gray-400">
                              {pricePlan === 'monthly' ? '/mensual' : '/anual'}
                            </span>
                          </p>
                          <p className="mb-4 text-gray-400 text-sm md:text-base">
                            {pricePlan === 'monthly'
                              ? 'Acceso completo a herramientas avanzadas.'
                              : 'Plan anual con descuento (ahorras 2 meses).'}
                          </p>
                          <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Fotos a tickets (20 al día)
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Chatbot limitado
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Guardar gastos e ingresos
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Categorización avanzada
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Reportes personalizados
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Interacción con micrófono
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Alertas en tiempo real
                              </span>
                            </li>
                          </ul>
                          <motion.button
                            className="relative w-full px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-lg font-semibold overflow-visible"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
                              filter: 'brightness(1.2)',
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Fondo animado para el botón */}
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: 'transparent',
                                backgroundSize: '200% 100%',
                                border: '2px solid transparent',
                                backgroundClip: 'padding-box, border-box',
                                backgroundOrigin: 'padding-box, border-box',
                                backgroundImage: 'linear-gradient(#1f2937, #1f2937), linear-gradient(90deg, #9333ea, #d8b4fe, #9333ea)',
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
                            {/* Texto del botón */}
                            <motion.span
                              className="relative z-10"
                              style={{
                                background: 'linear-gradient(90deg, #9333ea, #d8b4fe, #9333ea)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
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
                            >
                              Suscribirse
                            </motion.span>
                          </motion.button>
                        </motion.div>

                        {/* Plan Familiar */}
                        <motion.div
                          className="relative bg-gray-800 p-6 rounded-lg shadow-md flex-1 overflow-visible"
                          onMouseMove={(e) => handleMouseMove(e, 8)}
                          onMouseEnter={() => setHoveredCard(8)}
                          onMouseLeave={() => setHoveredCard(null)}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          {hoveredCard === 8 && (
                            <div
                              className="absolute inset-0 pointer-events-none rounded-lg"
                              style={{
                                background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(147, 51, 234, 0.1), transparent)`,
                              }}
                            />
                          )}
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {pricePlan === 'monthly' ? 'Familiar Mensual' : 'Familiar Anual'}
                          </h3>
                          <p className="text-2xl md:text-3xl font-bold mb-4">
                            {pricePlan === 'monthly' ? '$9.99' : '$99.99'}{' '}
                            <span className="text-base md:text-lg font-normal text-gray-400">
                              {pricePlan === 'monthly' ? '/mensual' : '/anual'}
                            </span>
                          </p>
                          <p className="mb-4 text-gray-400 text-sm md:text-base">
                            {pricePlan === 'monthly'
                              ? 'Comparte todas las funciones Premium con hasta 3 miembros.'
                              : 'Plan familiar anual con ahorro (paga 10 meses).'}
                          </p>
                          <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                {pricePlan === 'monthly' ? 'Todo lo del plan PREMIUM' : 'Todo lo del plan Familiar Mensual'}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Tickets y chatbot ilimitados
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                {pricePlan === 'monthly' ? 'Hasta 3 miembros familiares' : 'Acceso para 3 miembros'}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <input type="checkbox" checked readOnly className="text-purple-600" />
                              <span className="text-gray-400 text-sm md:text-base">
                                Análisis financiero conjunto
                              </span>
                            </li>
                            {pricePlan === 'monthly' && (
                              <>
                                <li className="flex items-center gap-2">
                                  <input type="checkbox" checked readOnly className="text-purple-600" />
                                  <span className="text-gray-400 text-sm md:text-base">
                                    Compartir gastos entre miembros
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <input type="checkbox" checked readOnly className="text-purple-600" />
                                  <span className="text-gray-400 text-sm md:text-base">
                                    Objetivos financieros familiares
                                  </span>
                                </li>
                              </>
                            )}
                          </ul>
                          <motion.button
                            className="relative w-full px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-lg font-semibold overflow-visible"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)',
                              filter: 'brightness(1.2)',
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Fondo animado para el botón */}
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: 'transparent',
                                backgroundSize: '200% 100%',
                                border: '2px solid transparent',
                                backgroundClip: 'padding-box, border-box',
                                backgroundOrigin: 'padding-box, border-box',
                                backgroundImage: 'linear-gradient(#1f2937, #1f2937), linear-gradient(90deg, #9333ea, #d8b4fe, #9333ea)',
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
                            {/* Texto del botón */}
                            <motion.span
                              className="relative z-10"
                              style={{
                                background: 'linear-gradient(90deg, #9333ea, #d8b4fe, #9333ea)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
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
                            >
                              Suscribirse
                            </motion.span>
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.section>

                  {/* Footer */}
                  <motion.footer
                    className="py-6 md:py-8 text-center relative z-0"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                  >
                    <p className="mb-2 text-gray-400 text-sm md:text-base">
                      © 2025 ExpensIA. Todos los derechos reservados.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                      <a
                        href="/politica-privacidad"
                        className="text-gray-400 hover:text-white transition duration-300 text-sm md:text-base"
                      >
                        Política de Privacidad
                      </a>
                      <a
                        href="/terminos-condiciones"
                        className="text-gray-400 hover:text-white transition duration-300 text-sm md:text-base"
                      >
                        Términos y Condiciones
                      </a>
                    </div>
                  </motion.footer>
                </div>

                {/* Overlay y Menú Desplegable para Móviles */}
                {isMenuOpen && (
                  <>
                    {/* Overlay para oscurecer el fondo cuando el menú está abierto */}
                    <motion.div
                      className="fixed inset-0 bg-black bg-opacity-100 z-40 md:hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={toggleMenu}
                    />

                    {/* Menú Desplegable */}
                    <motion.div
                      className="fixed top-0 right-0 w-64 h-full bg-gray-800 z-50 p-4 md:hidden"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Botón de Cerrar (X) dentro del Menú */}
                      <div className="flex justify-end">
                        <button className="text-gray-300 mb-4" onClick={toggleMenu}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <nav className="flex flex-col gap-4">
                        <ScrollLink
                          to="como-funciona"
                          smooth={true}
                          duration={500}
                          className="text-gray-300 hover:text-white transition duration-300 cursor-pointer text-base"
                          onClick={toggleMenu}
                        >
                          Cómo Funciona
                        </ScrollLink>
                        <ScrollLink
                          to="caracteristicas"
                          smooth={true}
                          duration={500}
                          className="text-gray-300 hover:text-white transition duration-300 cursor-pointer text-base"
                          onClick={toggleMenu}
                        >
                          Características
                        </ScrollLink>
                        <ScrollLink
                          to="precios"
                          smooth={true}
                          duration={500}
                          className="text-gray-300 hover:text-white transition duration-300 cursor-pointer text-base"
                          onClick={toggleMenu}
                        >
                          Precios
                        </ScrollLink>
                        <Link
                          to="/login"
                          className="text-gray-300 hover:text-white transition duration-300 px-4 py-2 rounded-full border-2 border-purple-600 text-base"
                          onClick={toggleMenu}
                        >
                          Iniciar Sesión
                        </Link>
                      </nav>
                    </motion.div>
                  </>
                )}
              </div>
            }
          />

          {/* Otras Rutas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default App;