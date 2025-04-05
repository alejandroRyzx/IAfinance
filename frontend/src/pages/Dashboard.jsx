// src/pages/Dashboard.jsx
import { useEffect, useState, useRef, useMemo } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement } from 'chart.js';

// Registrar los elementos necesarios para Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement);

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar la visibilidad del sidebar en móviles
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  // Estado para los gastos por periodo (día, semana, mes, año)
  const [expenses, setExpenses] = useState({
    day: 405.00,
    week: 405.00,
    month: 405.00,
    year: 405.00,
  });

  // Estado para las metas de ahorro y límites
  const [savingsGoals, setSavingsGoals] = useState({
    reminderDays: 0,
    savingsGoal: 0,
    dailyLimit: 20.00, // Valores de ejemplo para las metas
    weeklyLimit: 25.00,
    monthlyLimit: 100.00,
    annualLimit: 1000.00,
  });

  // Estado para controlar los valores temporales del modal
  const [tempGoals, setTempGoals] = useState(savingsGoals);
  const [hasChanges, setHasChanges] = useState(false);

  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  // Referencia para la sección de Metas de Ahorro
  const savingsGoalsRef = useRef(null);

  // Animación de scroll reveal para los componentes
  const scrollReveal = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          navigate('/login');
        }
        setLoading(false);
      },
      (err) => {
        setError('Error al verificar la autenticación: ' + err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      if (chart1Ref.current) chart1Ref.current.destroy();
      if (chart2Ref.current) chart2Ref.current.destroy();
      if (chart3Ref.current) chart3Ref.current.destroy();
    };
  }, [navigate]);

  // Calcular porcentajes dinámicos para los límites
  const calculatePercentage = (expense, limit) => {
    if (limit === 0) return 0;
    return Math.min((expense / limit) * 100, 100).toFixed(1);
  };

  // Datos para los gráficos
  const barData = useMemo(() => ({
    labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    datasets: [
      {
        label: 'Movimientos',
        data: [0, expenses.day, 0, 0, 0, 0, 0], // Simulamos movimientos solo el lunes
        backgroundColor: (context) => (context.raw > 0 ? '#facc15' : '#d1d5db'),
        borderRadius: 4,
        barThickness: 10,
      },
    ],
  }), [expenses.day]);

  const doughnutData = useMemo(() => ({
    labels: ['alimentación', 'educación'],
    datasets: [
      {
        data: [305, 100],
        backgroundColor: ['#34d399', '#c084fc'],
        hoverBackgroundColor: ['#2dd4bf', '#a855f7'],
        borderWidth: 0,
      },
    ],
  }), []);

  // Calcular el total dinámico para el gráfico de dona
  const totalExpenses = doughnutData.datasets[0].data.reduce((a, b) => a + b, 0);

  // Manejar cambios en los campos del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempGoals((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
    setHasChanges(true);
  };

  // Guardar cambios del modal
  const handleSaveGoals = () => {
    setSavingsGoals(tempGoals);
    setIsModalOpen(false);
    setHasChanges(false);
  };

  // Alternar la visibilidad del sidebar en móviles
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Función para manejar el clic en "Ajustes de Metas de Ahorro" con animación de scroll
  const handleSavingsGoalsClick = () => {
    if (savingsGoalsRef.current) {
      savingsGoalsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Centra la sección en la pantalla
      });
      // Abre el modal después de un retraso más corto
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300); // Reducido de 500ms a 300ms
    } else {
      setIsModalOpen(true); // Fallback si la ref no está disponible
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={scrollReveal}
    >
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 md:static md:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-t-4 border-purple-600 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 0c-2.2 0-4 1.8-4 4v2h8v-2c0-2.2-1.8-4-4-4zm-7 8h14a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
            Financebot v1.0.1
          </h1>
          <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 mb-4">
          <button className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Nuevo chat
          </button>
        </div>

        <nav className="mt-4">
          <div className="px-4 py-2 text-sm font-semibold text-gray-500">Gráficas</div>
          <Link
            to="/data"
            className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-purple-100 transition duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            Datos
          </Link>
          <div className="px-4 py-2 text-sm font-semibold text-gray-500 mt-4">Administración</div>
          <Link
            to="/tickets"
            className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-purple-100 transition duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
            Tickets y facturas
          </Link>
          <Link
            to="/transactions"
            className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-purple-100 transition duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Movimientos
          </Link>
          <Link
            to="/recurring"
            className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:bg-purple-100 transition duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m-6 4H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Gastos fijos
          </Link>
          <Link
            to="/categories"
            className="flex items-center gap-2 px-4 py-3 text-gray-800 border-2 border-purple-600 rounded-lg mx-4 hover:bg-purple-100 transition duration-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            Categorías
          </Link>
        </nav>

        <div className="absolute bottom-4 px-4">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span className="text-sm">Gadgetify</span>
            <span className="text-sm truncate">contact.gadgetifysv@gmail.com</span>
          </div>
        </div>
      </aside>

      {/* Overlay para cerrar el sidebar en móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => signOut(auth).then(() => navigate('/login'))}
            className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Contenedor Principal con Grid */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          {/* Columna Izquierda: Resumen Financiero y Movimientos Diarios */}
          <div className="space-y-4 md:space-y-6 lg:col-span-1">
            {/* 1. Resumen Financiero */}
            <motion.div
              className="p-4 rounded-xl shadow-sm"
              style={{ background: 'linear-gradient(135deg, #d8b4fe, #fed7aa, #f5f5f5)' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollReveal}
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-10">Resumen <br /> Financiero</h3>
              <div className="bg-white/65 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-600">Día</h4>
                    <p className="text-lg font-semibold text-gray-900">-${expenses.day.toFixed(2)}</p>
                    <p className="text-sm flex items-center justify-center gap-1 text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {calculatePercentage(expenses.day, savingsGoals.dailyLimit)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-600">Semana</h4>
                    <p className="text-lg font-semibold text-gray-900">-${expenses.week.toFixed(2)}</p>
                    <p className="text-sm flex items-center justify-center gap-1 text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {calculatePercentage(expenses.week, savingsGoals.weeklyLimit)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-600">Mes</h4>
                    <p className="text-lg font-semibold text-gray-900">-${expenses.month.toFixed(2)}</p>
                    <p className="text-sm flex items-center justify-center gap-1 text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {calculatePercentage(expenses.month, savingsGoals.monthlyLimit)}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4. Movimientos Diarios */}
            <motion.div
              className="bg-white p-4 md:p-6 rounded-xl shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollReveal}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Movimientos Diarios</h3>
              <p className="text-sm text-gray-600 mb-2">Ingresos y gastos de la semana actual</p>
              <div className="h-40">
                <Bar
                  ref={chart1Ref}
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const day = context.label;
                            const value = context.raw;
                            return `${day}: $${value.toFixed(2)} (Gastos: $${value.toFixed(2)}, Ingresos: $0.00)`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: { grid: { color: '#e5e7eb' }, beginAtZero: true },
                    },
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-4 flex items-center gap-1">
                Mayor movimiento el lunes
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </p>
            </motion.div>
          </div>

          {/* Columna Central: Metas de Ahorro y Límites */}
          <div className="space-y-4 md:space-y-6 lg:col-span-1">
            {/* 2. Metas de Ahorro */}
            <motion.div
              ref={savingsGoalsRef} // Agregamos la referencia aquí
              className="p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition duration-300 w-full max-w-[16rem] mx-auto"
              style={{ background: 'linear-gradient(135deg, #f3e8ff, #fef3e8, #ffffff)' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollReveal}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Metas de Ahorro</h3>
                  <p className="text-sm text-gray-500">Define tus objetivos de ahorro mensual y anual</p>
                </div>
                <button
                  className="text-blue-500 hover:text-blue-600"
                  onClick={handleSavingsGoalsClick} // Cambiamos a la función personalizada
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* 3. Límites de Gasto */}
            <motion.div
              className="flex overflow-x-auto space-x-4 md:space-y-4 md:flex-col md:overflow-x-hidden items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollReveal}
            >
              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 w-48 flex-shrink-0 md:w-full md:max-w-[16rem]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Límite diario</h3>
                    <p className="text-sm text-gray-500">Meta: ${savingsGoals.dailyLimit.toFixed(2)}</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeDasharray={`${calculatePercentage(expenses.day, savingsGoals.dailyLimit)}, 100`}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="33%" stopColor="#3b82f6" />
                          <stop offset="66%" stopColor="#facc15" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-gray-500">{calculatePercentage(expenses.day, savingsGoals.dailyLimit)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 w-48 flex-shrink-0 md:w-full md:max-w-[16rem]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Límite semanal</h3>
                    <p className="text-sm text-gray-500">Meta: ${savingsGoals.weeklyLimit.toFixed(2)}</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeDasharray={`${calculatePercentage(expenses.week, savingsGoals.weeklyLimit)}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-gray-500">{calculatePercentage(expenses.week, savingsGoals.weeklyLimit)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 w-48 flex-shrink-0 md:w-full md:max-w-[16rem]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Límite mensual</h3>
                    <p className="text-sm text-gray-500">Meta: ${savingsGoals.monthlyLimit.toFixed(2)}</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeDasharray={`${calculatePercentage(expenses.month, savingsGoals.monthlyLimit)}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-gray-500">{calculatePercentage(expenses.month, savingsGoals.monthlyLimit)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 w-48 flex-shrink-0 md:w-full md:max-w-[16rem]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Límite anual</h3>
                    <p className="text-sm text-gray-500">Meta: ${savingsGoals.annualLimit.toFixed(2)}</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeDasharray={`${calculatePercentage(expenses.year, savingsGoals.annualLimit)}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-gray-500">{calculatePercentage(expenses.year, savingsGoals.annualLimit)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 w-48 flex-shrink-0 md:w-full md:max-w-[16rem]">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Meta de Ahorro</h3>
                    <p className="text-sm text-gray-500">Meta: ${savingsGoals.savingsGoal.toFixed(2)}</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeDasharray="0, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-gray-500">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Detalle de Gastos y Gráfico de Gastos */}
          <div className="space-y-4 md:space-y-6 lg:col-span-1">
            <div className="space-y-4">
              {/* 6. Detalle de Gastos */}
              <motion.div
                className="bg-white p-4 md:p-6 rounded-xl shadow-sm w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scrollReveal}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Detalle de Gastos</h3>
                <p className="text-sm text-gray-600 mb-4">Por categoría</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-600">educación</span>
                    </div>
                    <span className="text-gray-800 font-semibold">$100.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                      <span className="text-gray-600">alimentación</span>
                    </div>
                    <span className="text-gray-800 font-semibold">$305.00</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-600 font-semibold">Total</span>
                  <span className="text-gray-900 font-bold">$405.00</span>
                </div>
              </motion.div>

              {/* 5. Gráfico de Gastos */}
              <motion.div
                className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-200 w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scrollReveal}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Gráfico de Gastos</h3>
                <p className="text-sm text-gray-600 mb-4">Distribución por categoría</p>
                <div className="flex justify-center relative">
                  <div className="w-56 h-56 md:w-64 md:h-64">
                    <Doughnut
                      ref={chart3Ref}
                      data={doughnutData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const label = context.label;
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                              },
                            },
                          },
                        },
                      }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-lg font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modal con animación más rápida */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} // Estado inicial del overlay
            animate={{ opacity: 1 }} // Estado al abrirse
            exit={{ opacity: 0 }} // Estado al cerrarse
            transition={{ duration: 0.2 }} // Reducido de 0.3s a 0.2s
          >
            {/* Overlay de fondo */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} // Reducido de 0.3s a 0.2s
              onClick={() => setIsModalOpen(false)}
            />
            {/* Contenido del modal */}
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg"
              initial={{ opacity: 0, y: 50 }} // Igual que scrollReveal: comienza invisible y desplazado hacia abajo
              animate={{ opacity: 1, y: 0 }} // Se anima a visible y en posición
              exit={{ opacity: 0, y: 50 }} // Al cerrarse, se desvanece y baja
              transition={{ duration: 0.4, ease: 'easeOut' }} // Reducido de 0.6s a 0.4s
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Límites y Metas</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Días de recordatorio para tareas pendientes</label>
                  <input
                    type="number"
                    name="reminderDays"
                    value={tempGoals.reminderDays}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Meta de ahorro</label>
                  <input
                    type="number"
                    name="savingsGoal"
                    value={tempGoals.savingsGoal}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Límite de gastos diarios</label>
                  <input
                    type="number"
                    name="dailyLimit"
                    value={tempGoals.dailyLimit}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Límite de gastos semanales</label>
                  <input
                    type="number"
                    name="weeklyLimit"
                    value={tempGoals.weeklyLimit}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Límite de gastos mensuales</label>
                  <input
                    type="number"
                    name="monthlyLimit"
                    value={tempGoals.monthlyLimit}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Límite de gastos anuales</label>
                  <input
                    type="number"
                    name="annualLimit"
                    value={tempGoals.annualLimit}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveGoals}
                disabled={!hasChanges}
                className={`w-full mt-6 py-2 rounded-lg text-white font-medium transition duration-300 ${
                  hasChanges ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Guardar Cambios
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}

export default Dashboard;