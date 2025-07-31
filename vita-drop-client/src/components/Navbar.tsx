"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./Themetoggle";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/donors", label: "Find Donors" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-gray-300 dark:border-gray-700 shado">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Left: User Avatar */}
        <div className="flex items-center space-x-3">
          <Logo />
        </div>

        {/* Center: Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:text-primary transition-colors font-medium ${
                  pathname === href ? "text-primary active" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Theme + Auth */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {/* Auth buttons */}
          <div className="hidden md:flex space-x-2">
            <Link
              href="/login"
              className="btn btn-sm bg-primary text-white hover:bg-opacity-80"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-sm btn-outline border-primary text-primary hover:bg-primary hover:text-white"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden "
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-100 px-4 pb-4">
          <ul className="flex flex-col space-y-3 mt-3">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block py-2 px-2 rounded hover:text-primary ${
                    pathname === href ? "text-primary active" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col space-y-2">
            <Link
              href="/login"
              className="btn btn-sm bg-primary text-white w-full"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-sm btn-outline border-primary text-primary w-full"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
