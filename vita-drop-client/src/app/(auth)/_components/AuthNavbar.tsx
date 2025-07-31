"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/Themetoggle";
import { FiUser, FiUserPlus, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function AuthNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (href: string) =>
    pathname === href ? "text-primary font-semibold" : "";

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-gray-300 dark:border-gray-700 shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-accent transition-colors duration-200 ${isActive(
                  link.href
                )}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Auth + Theme */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="btn btn-sm btn-outline border-primary text-primary hover:bg-primary hover:text-white"
          >
            <FiUser className="w-4 h-4" />
            Login
          </Link>
          <Link href="/register" className="btn btn-sm btn-primary text-white">
            <FiUserPlus className="w-4 h-4" />
            Register
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile: Theme + Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-base-200"
          >
            {isOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-4 bg-base-100 border-t border-base-300">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-accent transition-colors duration-200 ${isActive(
                  link.href
                )}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t border-base-300">
            <Link
              href="/login"
              className="btn btn-outline btn-sm border-primary text-primary hover:bg-primary hover:text-white"
            >
              <FiUser className="w-4 h-4" />
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-primary btn-sm text-white"
            >
              <FiUserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
