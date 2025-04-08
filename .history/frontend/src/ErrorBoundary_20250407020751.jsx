import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary: Error capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Algo salió mal
            </h1>
            <p className="text-gray-600 mb-4">
              Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta
              recargar la página o contacta al soporte.
            </p>
            <p className="text-gray-500 mb-6">
              Error: {this.state.error?.message || "Desconocido"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              aria-label="Recargar la página"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;