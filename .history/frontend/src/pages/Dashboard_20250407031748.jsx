import { useEffect, useState, useRef, useMemo } from 'react';
import { db, auth } from '../firebase';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement } from 'chart.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Chatbot from '../components/Chatbot';
import Sidebar from '../components/Sidebar';
import ErrorBoundary from '../ErrorBoundary';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [expenses, setExpenses] = useState({
    day: 0,
    week: 0,
    month: 0,
    year: 0,
  });
  const [savingsGoals, setSavingsGoals] = useState({
    reminderDays: 0,
    savingsGoal: 0,
    dailyLimit: 20.00,
    weeklyLimit: 25.00,
    monthlyLimit: 100.00,
    annualLimit: 1000.00,
  });
  const [tempGoals, setTempGoals] = useState(savingsGoals);
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const savingsGoalsRef = useRef(null);

  const scrollReveal = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  useEffect(() => {
    console.log("Dashboard: Iniciando fetchData...");

    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("Dashboard: Usuario autenticado:", user.uid);
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userTransactions = data.transactions || [];
            const userCategories = data.categories || [];
            setTransactions(userTransactions);
            setCategories(userCategories);
            setSavingsGoals(
              data.savingsGoals || {
                reminderDays: 0,
                savingsGoal: 0,
                dailyLimit: 20.00,
                weeklyLimit: 25.00,
                monthlyLimit: 100.00,
                annualLimit: 1000.00,
              }
            );
            setTempGoals(
              data.savingsGoals || {
                reminderDays: 0,
                savingsGoal: 0,
                dailyLimit: 20.00,
                weeklyLimit: 25.00,
                monthlyLimit: 100.00,
                annualLimit: 1000.00,
              }
            );

            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfYear = new Date(now.getFullYear(), 0, 1);

            const expensesCalc = userTransactions.reduce(
              (acc, transaction) => {
                if (transaction.type === 'expense') {
                  const transactionDate = new Date(transaction.date);
                  const amount = parseFloat(transaction.amount);

                  if (transactionDate >= startOfDay) acc.day += amount;
                  if (transactionDate >= startOfWeek) acc.week += amount;
                  if (transactionDate >= startOfMonth) acc.month += amount;
                  if (transactionDate >= startOfYear) acc.year += amount;
                }
                return acc;
              },
              { day: 0, week: 0, month: 0, year: 0 }
            );

            setExpenses(expensesCalc);
            console.log("Dashboard: Datos cargados correctamente:", { transactions: userTransactions, categories: userCategories, expenses: expensesCalc });
          } else {
            console.log("Dashboard: El documento del usuario no existe.");
          }
        } else {
          console.log("Dashboard: No hay usuario autenticado.");
        }
      } catch (error) {
        console.error("Dashboard: Error al obtener datos de Firestore:", error);
      }
    };

    fetchData();

    return () => {
      if (chart1Ref.current) chart1Ref.current.destroy();
      if (chart2Ref.current) chart1Ref.current.destroy();
      if (chart3Ref.current) chart3Ref.current.destroy();
    };
  }, []);

  const calculatePercentage = (expense, limit) => {
    if (limit === 0) return 0;
    return Math.min((expense / limit) * 100, 100).toFixed(1);
  };

  const barData = useMemo(() => {
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const dailyExpenses = Array(7).fill(0);

    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        const transactionDate = new Date(transaction.date);
        if (transactionDate >= startOfWeek && transactionDate <= now) {
          const dayIndex = transactionDate.getDay();
          dailyExpenses[dayIndex] += parseFloat(transaction.amount);
        }
      }
    });

    return {
      labels: days,
      datasets: [
        {
          label: 'Movimientos',
          data: dailyExpenses,
          backgroundColor: (context) => (context.raw > 0 ? '#facc15' : '#d1d5db'),
          borderRadius: 4,
          barThickness: 10,
        },
      ],
    };
  }, [transactions]);

  const doughnutData = useMemo(() => {
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        const category = transaction.category.toLowerCase();
        categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount);
      }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColors = labels.map((_, index) => {
      const colors = ['#34d399', '#c084fc', '#facc15', '#3b82f6', '#ef4444'];
      return colors[index % colors.length];
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors.map((color) =>
            color === '#34d399' ? '#2dd4bf' : color === '#c084fc' ? '#a855f7' : color
          ),
          borderWidth: 0,
        },
      ],
    };
  }, [transactions]);

  const totalExpenses = doughnutData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempGoals((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
    setHasChanges(true);
  };

  const handleSaveGoals = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { savingsGoals: tempGoals }, { merge: true });
      setSavingsGoals(tempGoals);
      setIsModalOpen(false);
      setHasChanges(false);
    }
  };

  const handleAddTransaction = async (transaction) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedTransactions = [...transactions, { ...transaction, id: Date.now() }];
      await setDoc(userDocRef, { transactions: updatedTransactions }, { merge: true });
      setTransactions(updatedTransactions);

      const now = new Date();
      const transactionDate = new Date(transaction.date);
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      if (transaction.type === 'expense') {
        const amount = parseFloat(transaction.amount);
        const updatedExpenses = { ...expenses };

        if (transactionDate >= startOfDay) updatedExpenses.day += amount;
        if (transactionDate >= startOfWeek) updatedExpenses.week += amount;
        if (transactionDate >= startOfMonth) updatedExpenses.month += amount;
        if (transactionDate >= startOfYear) updatedExpenses.year += amount;

        setExpenses(updatedExpenses);
      }
    }
  };

  const handleSavingsGoalsClick = () => {
    if (savingsGoalsRef.current) {
      savingsGoalsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300);
    } else {
      setIsModalOpen(true);
    }
  };

  console.log("Dashboard: Renderizando componente...");

  return (
    <motion.div
      className="flex min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={scrollReveal}
    >
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>

      <main className="flex-1 p-4 md:p-6">
        <header className="flex justify-end items-center mb-6">
          <button
            onClick={() => auth.signOut()}
            className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition duration-300 text-sm md:text-base"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          <div className="space-y-4 md:space-y-6 lg:col-span-1">
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
                Mayor movimiento el{' '}
                {barData.datasets[0].data.reduce((max, curr, i) => (curr > max.value ? { day: barData.labels[i], value: curr } : max), { day: '', value: 0 }).day}
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </p>
            </motion.div>
          </div>

          <div className="space-y-4 md:space-y-6 lg:col-span-1">
            <motion.div
              ref={savingsGoalsRef}
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
                  onClick={handleSavingsGoalsClick}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </motion.div>

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

          <div className="space-y-4 md:space-y-6 lg:col-span-1">
            <div className="space-y-4">
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
                  {doughnutData.labels.map((label, index) => (
                    <div key={label} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[index] }}
                        ></div>
                        <span className="text-gray-600">{label}</span>
                      </div>
                      <span className="text-gray-800 font-semibold">
                        ${doughnutData.datasets[0].data[index].toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-600 font-semibold">Total</span>
                  <span className="text-gray-900 font-bold">${totalExpenses.toFixed(2)}</span>
                </div>
              </motion.div>

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

        <Chatbot
          onAddTransaction={handleAddTransaction}
          messages={chatMessages}
          setMessages={setChatMessages}
          isOpen={isChatbotOpen}
          onClose={setIsChatbotOpen}
        />
      </main>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
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
    </motion.div>
  );
}

export default Dashboard;