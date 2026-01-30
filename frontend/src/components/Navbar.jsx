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
  User,
  LogIn,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

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
          {/* --- BRANDING --- */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-900 via-slate-900 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform">
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
              <NavLink to="/contact">Consultation</NavLink>
            </div>

            <div className="flex items-center pl-6 border-l border-slate-100 dark:border-slate-800 gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-all"
              >
                {mounted && (darkMode ? <Moon size={20} /> : <Sun size={20} />)}
              </button>

              {/* --- AUTH SECTION --- */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {user?.name?.split(" ")[0] || "Profile"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        ></div>
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-3 z-20 overflow-hidden"
                        >
                          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                              Authenticated As
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {user?.email}
                            </p>
                            {isAdmin && (
                              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                ADMIN ACCESS
                              </span>
                            )}
                          </div>

                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            >
                              <ShieldCheck
                                size={18}
                                className="text-amber-500"
                              />{" "}
                              Command Center
                            </Link>
                          )}

                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                            <Settings size={18} /> Account Settings
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors mt-2"
                          >
                            <LogOut size={18} /> Secure Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-amber-500 hover:text-white transition-all group"
                >
                  <LogIn
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  Sign In
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
              {["Home", "Gallery", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-200"
                >
                  {item}
                </Link>
              ))}

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-amber-500 text-white font-bold"
                >
                  <LogIn size={20} /> Sign In to Portal
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-rose-500 text-white font-bold"
                >
                  <LogOut size={20} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
