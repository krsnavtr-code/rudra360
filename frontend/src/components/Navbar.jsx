import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getOwnerInfo } from "../api/ownerInfoApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  ChevronDown,
  Trophy,
  LogOut,
  ShieldCheck,
  Star,
} from "lucide-react";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchOwnerInfo = async () => {
      try {
        const data = await getOwnerInfo();
        const primaryOwner =
          data.owners?.find((o) => o.isPrimary) || data.owners?.[0];
        setOwnerInfo(primaryOwner);
      } catch (err) {
        console.error("Owner fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerInfo();
  }, []);

  const phoneNumber = ownerInfo?.callNumber?.replace(/[^\d+]/g, "") || "";

  const NavLink = ({ to, children, className = "" }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative px-1 py-1 text-sm font-semibold tracking-wide transition-colors ${
          isActive
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-600 dark:text-slate-400 hover:text-amber-500"
        } ${className}`}
      >
        {children}
        {isActive && (
          <motion.span
            layoutId="navUnderline"
            className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-600"
          />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-amber-100/30 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* --- BRANDING: RUDRA360 --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-900 via-slate-900 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/10 group-hover:rotate-3 transition-transform">
                <Trophy size={24} className="text-amber-400" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Star
                  size={14}
                  className="text-amber-500 fill-amber-500 animate-pulse"
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-extrabold tracking-tight dark:text-white">
                rudra<span className="text-amber-600">360</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400">
                Award Function Originates
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center space-x-7">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/portfolio">Gallery</NavLink>

              {/* Awards Categories Dropdown */}
              <div className="relative group py-4">
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors">
                  Services{" "}
                  <ChevronDown
                    size={14}
                    className="group-hover:rotate-180 transition-transform"
                  />
                </button>
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 py-3 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200">
                  {[
                    "Corporate Awards",
                    "Cultural Galas",
                    "Technical Summits",
                    "Elite Recognition",
                  ].map((service) => (
                    <Link
                      key={service}
                      to={`/services/${service.toLowerCase().replace(" ", "-")}`}
                      className="block px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600"
                    >
                      {service}
                    </Link>
                  ))}
                </div>
              </div>

              <NavLink to="/contact">Consultation</NavLink>
            </div>

            <div className="flex items-center pl-6 border-l border-slate-100 dark:border-slate-800 gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-all"
              >
                {mounted && (darkMode ? <Moon size={20} /> : <Sun size={20} />)}
              </button>

              {!loading && phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-yellow-600 rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Phone size={16} />
                  Book Event
                </a>
              )}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-900/50"
                >
                  <ShieldCheck size={20} />
                </Link>
              )}
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400"
            >
              {mounted && (darkMode ? <Moon size={22} /> : <Sun size={22} />)}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {["Home", "Gallery", "Services", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                >
                  {item}
                </Link>
              ))}

              <div className="pt-4">
                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold flex items-center justify-center gap-3"
                  >
                    <Phone size={20} />
                    Contact Organizer
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
