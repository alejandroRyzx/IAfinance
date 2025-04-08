// src/pages/Transactions.jsx
import Sidebar from "../components/Sidebar";

const Transactions = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Movimientos</h1>
        <p>Contenido de Movimientos...</p>
      </div>
    </div>
  );
};

export default Transactions;