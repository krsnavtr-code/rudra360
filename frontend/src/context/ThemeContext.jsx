import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // LocalStorage check karein, agar nahi mile to system theme check karein
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes first
    root.classList.remove("light", "dark");

    // Add the current theme class - Tailwind uses 'dark' class for dark mode
    if (theme === "dark") {
      root.classList.add("dark");
    }

    // For custom properties, we'll keep using data-theme
    root.setAttribute("data-theme", theme);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Navbar mein aapne 'darkMode' boolean use kiya hai, isliye ise convert kar rahe hain
  const darkMode = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook
export const useTheme = () => {
  return useContext(ThemeContext);
};
