import { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary: Error capturado:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <h2 className="text-lg font-semibold">Algo salió mal.</h2>
          <p>{this.state.error?.toString()}</p>
          <details className="mt-2">
            <summary>Detalles del error</summary>
            <pre className="text-sm">{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;