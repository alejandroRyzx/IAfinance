// src/pages/Recurring.jsx
import Sidebar from "../components/Sidebar";

const Recurring = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gastos Fijos</h1>
        <p>Contenido de Gastos Fijos...</p>
      </div>
    </div>
  );
};

export default Recurring;