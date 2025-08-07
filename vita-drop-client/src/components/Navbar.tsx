"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./Themetoggle";
import Logo from "./Logo";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import axiosSecure from "@/lib/axiosSecure";

type UserType = {
  user: {
    fullName: string;
    photo?: {
      profilePhoto?: string;
    };
  };
  error?: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/donors", label: "Find Donors" },
  ];

  useEffect(() => {
    profile();
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdownOpen]);

  const profile = async () => {
    if (!localStorage.getItem("accessToken")) return;
    const res = await axiosSecure.get("/users/profile");

    if (!res.data) return;
    if (!res.data.success) {
      console.log(res.data.message);
      return;
    }
    setUser(res.data);
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    const res = await axiosSecure.post(
      "/users/logout",
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("accessToken");
    console.log("Logout response:", res.data);
    if (res.data.error) {
      console.error("Logout failed:", res.data.error);
      return;
    }
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-gray-300 dark:border-gray-700 shadow">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Left: Logo */}
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
        <div className="flex items-center space-x-3 relative">
          <ThemeToggle />

          {/* Auth buttons / User Avatar */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="relative">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-full transition-shadow"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    aria-label="Open user menu"
                  >
                    <div className="flex items-center gap-2">
                      {user?.user?.photo?.profilePhoto ? (
                        <Image
                          width={40}
                          height={40}
                          src={user.user.photo.profilePhoto}
                          alt={user.user.fullName}
                          className="w-8 h-8 rounded-full object-cover border bg-gray-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full" />
                      )}
                      <span
                        className="hidden lg:inline-block font-medium l max-w-[120px] truncate"
                        title={user.user.fullName}
                      >
                        {user.user.fullName}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown menu with framer-motion animation */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{
                          duration: 0.18,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        className="absolute right-0 mt-2 w-52 bg-base-100 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md z-50 origin-top-right"
                        tabIndex={-1}
                      >
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 btn transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 btn text-red-600 dark:text-red-400 rounded-b-md transition-colors"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
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
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.22,
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="md:hidden bg-base-100 border-t border-base-100 px-4 pb-4"
          >
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
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    {user.user.photo?.profilePhoto ? (
                      <Image
                        width={40}
                        height={40}
                        src={user.user.photo.profilePhoto}
                        alt={user.user.fullName}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-gray-500" />
                    )}
                    <span
                      className="font-medium  max-w-[120px] truncate"
                      title={user.user.fullName}
                    >
                      {user.user.fullName}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="btn btn-sm btn-outline w-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="btn btn-sm bg-red-500 text-white w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
