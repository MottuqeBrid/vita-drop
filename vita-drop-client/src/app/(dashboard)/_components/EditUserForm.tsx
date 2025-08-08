"use client";

import axiosSecure from "@/lib/axiosSecure";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

interface EditUserFormProps {
  id: string;
}

export default function EditUserForm({ id }: EditUserFormProps) {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get(`/users/profile/${id}`);
        console.log("Fetched user data:", res.data);
        if (res.data?.user) {
          reset(res.data.user); // Prefill form with user data
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire("Error", "Failed to load user data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, reset]);

  // Submit updated data
  const onSubmit = async (data: any) => {
    try {
      const res = await axiosSecure.put(`/users/profile/${id}`, data);
      console.log("Update response:", res.data);
      if (res.data?.success) {
        Swal.fire("Success", "Profile updated successfully", "success");
      } else {
        Swal.fire("Error", res.data?.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-lg mx-auto rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">
                {String(errors.fullName.message)}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              {...register("phone")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date of Birth</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              {...register("gender")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register("weight")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Medical Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Blood Group</label>
            <select
              {...register("bloodGroup")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
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
          </div>
          <div>
            <label className="block mb-1 font-medium">Willing to Donate?</label>
            <select
              {...register("willingToDonate")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          {/* <div>
            <label className="block mb-1 font-medium">
              Available for Donation?
            </label>
            <select
              {...register("isAvailable")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div> */}
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Present Address</label>
            <input
              type="text"
              {...register("location.presentAddress")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Permanent Address</label>
            <input
              type="text"
              {...register("location.permanentAddress")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              {...register("location.city")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              type="text"
              {...register("location.state")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input
              type="text"
              {...register("location.country")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Postal Code</label>
            <input
              type="text"
              {...register("location.postalCode")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Profile Photo */}
        <div>
          <label className="block mb-1 font-medium">Profile Photo URL</label>
          <input
            type="text"
            {...register("photo.profilePhoto")}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Emergency Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Emergency Name</label>
            <input
              type="text"
              {...register("emergencyContact.name")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Emergency Phone</label>
            <input
              type="text"
              {...register("emergencyContact.phone")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Relationship</label>
            <input
              type="text"
              {...register("emergencyContact.relationship")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Role (readonly) */}
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <input
            type="text"
            {...register("role")}
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800"
            readOnly
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </motion.div>
  );
}
