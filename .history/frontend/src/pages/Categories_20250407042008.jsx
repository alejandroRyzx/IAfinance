// src/pages/Categories.jsx
import Sidebar from "../components/Sidebar";

const Categories = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Categorías</h1>
        <p>Contenido de Categorías...</p>
      </div>
    </div>
  );
};

export default Categories;