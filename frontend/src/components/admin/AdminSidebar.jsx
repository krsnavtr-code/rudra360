import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserIcon, HomeIcon, PhotoIcon, TagIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: (
        <HomeIcon className="h-5 w-5" />
      ),
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: (
        <UserIcon className="h-5 w-5" />
      ),
    },
    {
      name: "Media Gallery",
      path: "/admin/media-gallery",
      icon: (
        <PhotoIcon className="h-5 w-5" />
      ),
    },
    {
      name: "Media Tags",
      path: "/admin/media/tags",
      icon: (
        <TagIcon className="h-5 w-5" />
      ),
    },
    {
      name: "Owner Info",
      path: "/admin/owner-info",
      icon: (
        <BuildingOffice2Icon className="h-5 w-5" />
      ),
    },
  ];

  return (
    <div
      className={`h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-20"} flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {isExpanded && (
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            Admin Panel
          </span>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L6.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M15.707 10.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L12.586 10l-4.293-4.293a1 1 0 011.414-1.414l5 5z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                  isExpanded ? "justify-start" : "justify-center"
                }
                  ${
                    location.pathname === item.path
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isExpanded && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div
          className={`flex items-center ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                admin@example.com
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
