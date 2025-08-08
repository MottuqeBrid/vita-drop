"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaTint,
  FaUser,
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Image from "next/image";
import ThemeToggle from "@/components/Themetoggle";
import Logo from "@/components/Logo";
import axiosSecure from "@/lib/axiosSecure";

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{
    fullName?: string;
    email?: string;
    role?: string;
    _id?: string;
    photo?: { profilePhoto?: string };
  } | null>(null);
  const pathname = usePathname();

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
    { href: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <motion.nav
      className="shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md border-b  border-gray-800"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <Logo />

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <span
            className="font-medium text-gray-700 truncate"
            title={user?.fullName}
          >
            {user?.fullName || "User"}
          </span>
          <Image
            width={32}
            height={32}
            src={user?.photo?.profilePhoto || "https://i.pravatar.cc/32"}
            alt="Profile"
            className="w-8 h-8 rounded-full border object-cover"
          />
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="block  text-xl cursor-pointer"
        >
          <FaBars />
        </button>
      </div>

      {/* Side Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-base-900 bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Side Drawer */}
            <motion.aside
              className="fixed top-0 left-0 min-h-screen bg-base-300 w-72 max-w-full shadow-lg z-50 p-6 flex flex-col gap-6 overflow-y-scroll"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center w-full mb-4">
                {/* <Logo /> */}
                {/* Close Button */}
                <div className=""></div>
                <button
                  className="self-end text-2xl text-gray-800 cursor-pointer"
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
                <p className="text-lg font-bold">{user?.fullName || "User"}</p>
                <p className="text-sm ">{user?.role || "User"}</p>
                <small className="text-gray-500">{user?.email}</small>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 font-medium ">
                {navItems.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors
                      ${
                        pathname === href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-primary/10 hover:text-primary"
                      }
                    `}
                    aria-current={pathname === href ? "page" : undefined}
                  >
                    {icon} {label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-auto flex items-center gap-2 text-red-600 hover:text-red-800"
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
