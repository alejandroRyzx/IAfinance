// src/components/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Cargando...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;