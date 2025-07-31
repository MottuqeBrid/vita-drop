"use client";

import { useEffect, useState } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(savedTheme || systemTheme);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        relative inline-flex items-center justify-center w-10 h-10 rounded-full 
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
        border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        hover:scale-105 active:scale-95 hover:shadow-md
      "
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <div className="relative">
        {/* Light Mode Icon */}
        <MdLightMode
          className={`
            absolute inset-0 text-xl transition-all duration-300 ease-in-out
            ${
              theme === "dark"
                ? "opacity-0 rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }
          `}
        />

        {/* Dark Mode Icon */}
        <MdDarkMode
          className={`
            text-xl transition-all duration-300 ease-in-out
            ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-0"
            }
          `}
        />
      </div>
    </button>
  );
}
