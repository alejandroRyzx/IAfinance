// src/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Algo salió mal.
            </h1>
            <p className="text-gray-300 mb-6">
              Lo sentimos, ocurrió un error. Por favor, intenta de nuevo.
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
    return this.props.children;
  }
}

export default ErrorBoundary;