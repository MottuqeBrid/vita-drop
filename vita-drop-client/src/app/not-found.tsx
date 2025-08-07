"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
      <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Sorry, the page you&#39;re looking for doesn&#39;t exist.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
      >
        <FaHome />
        Return Home
      </Link>
    </motion.div>
  );
}
