// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Recurring from "./pages/Recurring";
import Categories from "./pages/Categories";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal (landing page) */}
        <Route path="/" element={<LandingPage />} />
        {/* Ruta para la página de login */}
        <Route path="/login" element={<Login />} />
        {/* Ruta para la página de registro */}
        <Route path="/register" element={<Register />} />
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
        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Componente para manejar rutas no encontradas
function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Página No Encontrada</h1>
        <p className="text-gray-300 mb-6">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}

export default App;