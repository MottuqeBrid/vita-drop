"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaTint,
  FaCog,
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Image from "next/image";
import ThemeToggle from "@/components/Themetoggle";
import Logo from "@/components/Logo";
import axiosSecure from "@/lib/axiosSecure";

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  interface User {
    fullName?: string;
    email?: string;
    role?: string;
    _id?: string;
    photo?: {
      profilePhoto?: string;
    };
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) profile();
  }, []);

  const profile = async () => {
    try {
      const res = await axiosSecure.get("/users/profile");
      if (res.data?.success) setUser(res.data.user);
      else console.warn(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/dashboard/users", label: "Users", icon: <FaUsers /> },
    { href: "/dashboard/donors", label: "Donors", icon: <FaTint /> },
    { href: "/dashboard/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <motion.nav
      className="shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50 "
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <Logo />

      {/* Desktop Links */}
      {/* <ul className="hidden md:flex space-x-6 font-medium">
        {navItems.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400 transition"
            >
              {icon} {label}
            </Link>
          </li>
        ))}
      </ul> */}

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Image
          width={40}
          height={40}
          src={user?.photo?.profilePhoto || "https://i.pravatar.cc/40"}
          alt="Profile"
          className="w-10 h-10 rounded-full border object-cover"
        />

        <button onClick={() => setIsOpen(true)} className=" -200 text-xl">
          <FaBars />
        </button>
      </div>

      {/* Side Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0  z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Side Drawer */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg z-50 p-6 flex flex-col gap-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center w-full mb-4">
                <Logo />
                {/* Close Button */}
                <button
                  className="self-end text-2xl text-gray-600 dark:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
              {/* User Info */}
              <div className="flex flex-col items-center text-center gap-2">
                <Image
                  width={60}
                  height={60}
                  src={user?.photo?.profilePhoto || "https://i.pravatar.cc/60"}
                  alt="Profile"
                  className="rounded-full object-cover border"
                />
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {user?.fullName || "User"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.role || "User"}
                </p>
                <small className="text-gray-500 dark:text-gray-400">
                  {user?.email}
                </small>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 font-medium text-gray-700 dark:text-gray-200">
                {navItems.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 hover:text-red-600 dark:hover:text-red-400 transition"
                  >
                    {icon} {label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-auto flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <BiLogOut /> Logout
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
