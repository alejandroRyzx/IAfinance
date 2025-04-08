import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Finance Assistant</Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Registrarse</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;