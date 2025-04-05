// src/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el próximo render muestre un UI de respaldo
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de logging (opcional)
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Renderiza un UI de respaldo si hay un error
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Algo salió mal
            </h1>
            <p className="text-gray-600 mb-4">
              Lo sentimos, ocurrió un error inesperado. Por favor, recarga la página o intenta de nuevo más tarde.
            </p>
            <p className="text-red-600 mb-4">
              Error: {this.state.error?.message || 'Desconocido'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    // Si no hay error, renderiza los hijos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;