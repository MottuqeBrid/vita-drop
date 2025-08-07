"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { motion } from "framer-motion";
import Link from "next/link";
import axiosSecure from "@/lib/axiosSecure";
import { useRouter } from "next/navigation";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const res = await axiosSecure.post("/users/login", data);

      if (res.data?.error) {
        setServerError(res.data.error);
        return;
      }
      localStorage.setItem("accessToken", res.data.accessToken);

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof Error) {
        const errorResponse = error as {
          response?: { data?: { error: string } };
        };
        setServerError(errorResponse?.response?.data?.error || error.message);
      } else {
        setServerError("An error occurred during login.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-base-100 p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 80,
          damping: 18,
        }}
      >
        {/* Email */}
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="input input-bordered w-full pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute z-30 right-2 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-primary focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>
        )}

        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
