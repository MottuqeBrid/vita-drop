"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
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
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const result = await response.json();
      console.log("Registration successful:", result);
      // Redirect or show success message
      // e.g., router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error appropriately, e.g., show a notification
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
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="input input-bordered w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {typeof errors.password?.message === "string"
                ? errors.password.message
                : null}
            </p>
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
            <option value="A−">A−</option>
            <option value="B+">B+</option>
            <option value="B−">B−</option>
            <option value="O+">O+</option>
            <option value="O−">O−</option>
            <option value="AB+">AB+</option>
            <option value="AB−">AB−</option>
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
