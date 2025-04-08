import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { FinanceSidebar, SidebarBody, SidebarLink } from "../components/ui/FinanceSidebar";
import {
  IconHome,
  IconReceipt,
  IconTransfer,
  IconRepeat,
  IconCategory,
  IconMessage,
  IconChevronDown,
  IconUserPlus,
  IconUser,
  IconCreditCard,
  IconLogout,
} from "@tabler/icons-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || "Usuario");
      setUserPhoto(user.photoURL || null);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <IconHome className="h-5 w-5 text-gray-600" />,
    },
    {
      href: "/tickets",
      label: "Tickets y facturas",
      icon: <IconReceipt className="h-5 w-5 text-gray-600" />,
    },
    {
      href: "/transactions",
      label: "Movimientos",
      icon: <IconTransfer className="h-5 w-5 text-gray-600" />,
    },
    {
      href: "/recurring",
      label: "Gastos fijos",
      icon: <IconRepeat className="h-5 w-5 text-gray-600" />,
    },
    {
      href: "/categories",
      label: "Categorías",
      icon: <IconCategory className="h-5 w-5 text-gray-600" />,
    },
  ];

  return (
    <FinanceSidebar>
      <SidebarBody className="h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0-4c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79-4-4-4z"
            />
          </svg>
          <span className="text-lg font-bold text-gray-800">
            Financebot v1.0.1
          </span>
        </div>

        {/* Botón Nuevo Chat */}
        <Link
          to="/chat"
          className="flex items-center gap-2 p-3 bg-purple-600 text-white rounded-lg mb-6 hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Iniciar un nuevo chat"
        >
          <IconMessage className="h-5 w-5" aria-hidden="true" />
          <span>Nuevo chat</span>
        </Link>

        {/* Sección Gráficas */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Gráficas
          </h3>
          <SidebarLink
            link={navItems[0]}
            className={
              location.pathname === navItems[0].href
                ? "bg-purple-100 text-purple-800 rounded-lg"
                : "text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            }
          />
        </div>

        {/* Sección Administración */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Administración
          </h3>
          {navItems.slice(1).map((item) => (
            <SidebarLink
              key={item.href}
              link={item}
              className={
                location.pathname === item.href
                  ? "bg-purple-100 text-purple-800 rounded-lg"
                  : "text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              }
            />
          ))}
        </div>

        {/* Menú desplegable del usuario */}
        <div className="mt-auto">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-3 p-2 w-full rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-expanded={isDropdownOpen}
            aria-label="Menú de usuario"
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={`Foto de perfil de ${userEmail}`}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                {userEmail.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate">{userEmail}</span>
            <IconChevronDown
              className={`w-4 h-4 ml-auto transform transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {isDropdownOpen && (
            <motion.div
              className="mt-2 bg-white shadow-lg rounded-lg p-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="flex items-center gap-2 p-2 w-full text-gray-600 hover:bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Incrementar límite"
              >
                <IconUserPlus className="w-4 h-4" aria-hidden="true" />
                Incrementar Límite
              </button>
              <button
                className="flex items-center gap-2 p-2 w-full text-gray-600 hover:bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Cuenta"
              >
                <IconUser className="w-4 h-4" aria-hidden="true" />
                Account
              </button>
              <button
                className="flex items-center gap-2 p-2 w-full text-gray-600 hover:bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Facturación"
              >
                <IconCreditCard className="w-4 h-4" aria-hidden="true" />
                Billing
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 p-2 w-full text-red-600 hover:bg-red-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Cerrar sesión"
              >
                <IconLogout className="w-4 h-4" aria-hidden="true" />
                Log out
              </button>
            </motion.div>
          )}
        </div>
      </SidebarBody>
    </FinanceSidebar>
  );
};

export default Sidebar;