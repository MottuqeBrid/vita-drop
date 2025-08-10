"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import axiosSecure from "@/lib/axiosSecure";
import { useRouter } from "next/navigation";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type BloodRequestForm = {
  bloodGroup: string;
  quantity: number;
  hospitalName: string;
  hospitalAddress: string;
  reasonForRequest?: string;
};

export default function AddBloodRequestPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BloodRequestForm>();

  const onSubmit = async (data: BloodRequestForm) => {
    setLoading(true);
    const requestData = {
      bloodGroup: data.bloodGroup,
      quantity: data.quantity,
      hospital: {
        name: data.hospitalName,
        address: data.hospitalAddress,
      },
      reasonForRequest: data.reasonForRequest,
    };
    try {
      // Replace with your API endpoint
      const res = await axiosSecure.post("/blood-requests", {
        ...requestData,
      });
      console.log("Response:", res);
      const result = await res?.data;
      if (result?.success) {
        Swal.fire("Success", "Blood request submitted!", "success");
        reset();
        router.push("/dashboard/blood-request");
      } else {
        Swal.fire(
          "Error",
          result.message || "Failed to submit request",
          "error"
        );
      }
    } catch (e) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-base-100 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Request Blood</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Blood Group</label>
          <select
            {...register("bloodGroup", { required: "Blood group is required" })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          {errors.bloodGroup && (
            <span className="text-error text-sm">
              {errors.bloodGroup.message}
            </span>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Quantity (bags)</label>
          <input
            type="number"
            min={1}
            {...register("quantity", {
              required: "Quantity is required",
              min: 1,
            })}
            className="input input-bordered w-full"
          />
          {errors.quantity && (
            <span className="text-error text-sm">
              {errors.quantity.message}
            </span>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Hospital Name</label>
          <input
            type="text"
            {...register("hospitalName", {
              required: "Hospital name is required",
            })}
            className="input input-bordered w-full"
          />
          {errors.hospitalName && (
            <span className="text-error text-sm">
              {errors.hospitalName.message}
            </span>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Hospital Address</label>
          <input
            type="text"
            {...register("hospitalAddress", {
              required: "Hospital address is required",
            })}
            className="input input-bordered w-full"
          />
          {errors.hospitalAddress && (
            <span className="text-error text-sm">
              {errors.hospitalAddress.message}
            </span>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Reason for Request</label>
          <textarea
            {...register("reasonForRequest")}
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Optional"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
