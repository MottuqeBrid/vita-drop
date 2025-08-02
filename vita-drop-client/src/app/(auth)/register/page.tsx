"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axiosSecure from "@/lib/axiosSecure";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  type RegisterFormData = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    bloodGroup: string;
    dateOfBirth: string;
    gender: string;
    photo?: {
      profilePhoto: string;
    };
    termsConditions: boolean;
    // Add more fields if needed
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    const newData = { ...data };
    if (photoPreview) {
      newData.photo = { profilePhoto: photoPreview };
    }
    console.log(newData);
    // Handle form submission logic here, e.g., send data to API
    try {
      const result = await axiosSecure.post("/users/register", newData);
      localStorage.setItem("accessToken", result.data?.accessToken);
      if (result.data?.error) {
        setServerError(result.data?.error);
        return;
      }
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      if (error instanceof Error) {
        const errorResponse = error as {
          response?: { data?: { error: string } };
        };
        setServerError(errorResponse?.response?.data?.error || error.message);
      } else {
        setServerError("An error occurred");
      }
    }
  };

  // Watch password fields to validate confirm password
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    setPhotoLoading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoLoading(false);
      return;
    }
    // Preview immediately
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    // Upload
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setPhotoError(data.error);
        setPhotoLoading(false);
        return;
      }
      setPhotoPreview(data.url);
    } catch (err) {
      console.log(err);
      setPhotoError("Failed to upload image. Please try again.");
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-secondary">
        Register
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-base-100 p-6 rounded-xl shadow-lg"
      >
        {/* Full Name */}
        <div>
          <label className="label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName", { required: "Full name is required" })}
            className="input input-bordered w-full"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">
              {typeof errors.fullName?.message === "string"
                ? errors.fullName.message
                : null}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {typeof errors.email?.message === "string"
                ? errors.email.message
                : null}
            </p>
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

        {/* Confirm Password */}
        <div>
          <label className="label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
            })}
            className="input input-bordered w-full"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {typeof errors.confirmPassword?.message === "string"
                ? errors.confirmPassword.message
                : null}
            </p>
          )}
          {password !== confirmPassword && confirmPassword.length > 0 && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}
        </div>

        {/* Blood Group Dropdown */}
        <div>
          <label className="label">Blood Group</label>
          <select
            {...register("bloodGroup", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.bloodGroup && (
            <p className="text-red-500 text-sm">Blood group is required</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="label" htmlFor="dob">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            {...register("dateOfBirth", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">Date of birth is required</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="label">Gender</label>
          <div className="flex gap-4">
            <label className="label cursor-pointer">
              <input
                type="radio"
                value="male"
                {...register("gender", { required: true })}
                className="radio"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="radio"
                value="female"
                {...register("gender", { required: true })}
                className="radio"
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="radio"
                value="other"
                {...register("gender", { required: true })}
                className="radio"
              />
              <span className="ml-2">Other</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm">Gender is required</p>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="label" htmlFor="photo">
            Profile Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
            aria-describedby="photo-error"
          />
          {photoLoading && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span className="loading loading-spinner loading-sm" />
              Uploading photo...
            </div>
          )}
          {photoError && (
            <p id="photo-error" className="text-red-500 text-sm mt-1">
              {photoError}
            </p>
          )}
        </div>

        {/* Profile Preview */}
        {photoPreview && (
          <div className="text-center mt-2">
            <p className="text-sm text-gray-500 mb-2">Profile Preview:</p>
            <Image
              width={96}
              height={96}
              src={photoPreview}
              alt="Profile Preview"
              className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-primary shadow-md"
            />
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            {...register("termsConditions", { required: true })}
            className="checkbox"
          />
          <label className="label cursor-pointer">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms and Conditions
            </Link>
          </label>
        </div>
        {errors.termsConditions && (
          <p className="text-red-500 text-sm">You must agree to the terms</p>
        )}

        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
        {serverError && (
          <p className="text-red-500 text-sm mt-2">{serverError}</p>
        )}
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
