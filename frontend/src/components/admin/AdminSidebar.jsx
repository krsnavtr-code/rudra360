import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Tags,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Mail,
  Briefcase,
} from "lucide-react";

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout, user } = useAuth(); // Assuming user details come from AuthContext
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Portfolio",
      path: "/admin/portfolio",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Client Management",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Event Gallery",
      path: "/admin/media-gallery",
      icon: <Trophy size={20} />,
    },
    {
      name: "Gallery Tags",
      path: "/admin/media/tags",
      icon: <Tags size={20} />,
    },
    {
      name: "Contact Inquiries",
      path: "/admin/contact-inquiries",
      icon: <Mail size={20} />,
    },
    {
      name: "Business Settings",
      path: "/admin/owner-info",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className={`relative h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-in-out ${
        isExpanded ? "w-52" : "w-14"
      } flex flex-col z-50`}
    >
      {/* Toggle Button - Floating Style */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-10 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors z-50"
      >
        {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Brand Identity */}
      <div className="p-2 flex items-center gap-3 overflow-hidden">
        <div className="min-w-[35px] h-10 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
          <Sparkles size={20} />
        </div>
        {isExpanded && (
          <div className="flex flex-col animate-in fade-in duration-500">
            <span className="text-lg font-black tracking-tight dark:text-white">
              rudra<span className="text-amber-500">360</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Admin Suite
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-1 py-2 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className={`${isActive ? "text-white" : "group-hover:text-amber-500"}`}
              >
                {item.icon}
              </span>
              {isExpanded && (
                <span className="ml-4 font-semibold text-sm truncate animate-in slide-in-from-left-2">
                  {item.name}
                </span>
              )}
              {!isExpanded && (
                <div className="absolute left-full ml-6 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-1 space-y-1 border-t border-slate-200 dark:border-slate-800">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center w-full p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isExpanded && (
            <span className="ml-4 text-sm font-semibold">
              {darkMode ? "Light Appearance" : "Dark Appearance"}
            </span>
          )}
        </button>

        {/* User Account & Logout */}
        <div
          className={`mt-2 p-1 rounded-2xl ${isExpanded ? "bg-slate-100 dark:bg-slate-800/50" : ""}`}
        >
          <div className="flex items-center justify-between">
            {isExpanded && (
              <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-200">
                  AD
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-bold dark:text-white truncate">
                    {user?.name || "Rudra Admin"}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className={`p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all ${
                !isExpanded && "w-full flex justify-center"
              }`}
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
