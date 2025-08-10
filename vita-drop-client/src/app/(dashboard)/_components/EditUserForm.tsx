"use client";

import axiosSecure from "@/lib/axiosSecure";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import { FiUser, FiMapPin, FiDroplet, FiShield } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ro } from "date-fns/locale";

interface EditUserFormProps {
  id: string;
}

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

type FormValues = {
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // yyyy-MM-dd
  gender?: "male" | "female" | "other" | "";
  weight?: number;
  bloodGroup?: BloodGroup | "";
  willingToDonate?: boolean | string;
  isAvailable?: boolean | string;
  location?: {
    presentAddress?: {
      country?: string;
      division?: string;
      district?: string;
      upozilla?: string;
      union?: string;
      street?: string;
      houseNumber?: string;
      postalCode?: string;
    };
    permanentAddress?: {
      country?: string;
      division?: string;
      district?: string;
      upozilla?: string;
      union?: string;
      street?: string;
      houseNumber?: string;
      postalCode?: string;
    };
  };
  photo?: {
    profilePhoto?: string;
    coverPhoto?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  lastDonationDate?: {
    place?: string;
    date?: string; // yyyy-MM-dd
    // bloodGroup?: BloodGroup;
    verificationDocument?: string;
  };
  role?: string;
};

type ApiUser = FormValues & {
  nextDonationDate?: string | Date;
  isEligible?: boolean;
  numberOfDonations?: number;
};

export default function EditUserForm({ id }: EditUserFormProps) {
  const [loading, setLoading] = useState(true);
  const [sameAddress, setSameAddress] = useState(false);
  const router = useRouter();
  // Address dropdown types
  interface AddressOption {
    id: string;
    name: string;
    bn_name?: string;
  }
  const [demoDivisions, setDemoDivisions] = useState<AddressOption[]>([]);
  const [demoDistricts, setDemoDistricts] = useState<AddressOption[]>([]);
  const [demoUpozillas, setDemoUpozillas] = useState<AddressOption[]>([]);
  const [demoUnions, setDemoUnions] = useState<AddressOption[]>([]);
  // Permanent address dropdowns
  const [permDivisions, setPermDivisions] = useState<AddressOption[]>([]);
  const [permDistricts, setPermDistricts] = useState<AddressOption[]>([]);
  const [permUpozillas, setPermUpozillas] = useState<AddressOption[]>([]);
  const [permUnions, setPermUnions] = useState<AddressOption[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosSecure.get(`/users/profile/${id}`);
        if (res.data?.user) {
          reset(res.data.user as ApiUser);
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

  // Sync permanent address with present address if checkbox is checked
  const present = watch("location.presentAddress");
  const permanent = watch("location.permanentAddress");
  useEffect(() => {
    if (sameAddress && present) {
      const keys = [
        "country",
        "district",
        "upozilla",
        "union",
        "street",
        "houseNumber",
        "postalCode",
      ] as const;
      keys.forEach((key) => {
        setValue(
          `location.permanentAddress.${key}` as const,
          present?.[key] || ""
        );
      });
    }
  }, [sameAddress, present, setValue]);

  // Fetch divisions for both present and permanent address
  useEffect(() => {
    const getDivisions = async () => {
      const res = await fetch("https://bdapi.vercel.app/api/v.1/division");
      const data = await res.json();
      setDemoDivisions(data?.data || []);
      setPermDivisions(data?.data || []);
    };
    getDivisions();
  }, []);
  // Present address: districts
  useEffect(() => {
    const getDistricts = async () => {
      if (demoDivisions.length === 0) return;
      const selectedDivision = demoDivisions.find(
        (div) => div?.name === present?.division
      );
      if (!selectedDivision) return setDemoDistricts([]);
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/district/${selectedDivision?.id}`
      );
      const data = await res.json();
      setDemoDistricts(data?.data || []);
    };
    getDistricts();
  }, [demoDivisions, present?.division]);

  // Permanent address: districts
  useEffect(() => {
    const getDistricts = async () => {
      if (permDivisions.length === 0) return;
      const selectedDivision = permDivisions.find(
        (div) => div?.name === permanent?.division
      );
      if (!selectedDivision) return setPermDistricts([]);
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/district/${selectedDivision?.id}`
      );
      const data = await res.json();
      setPermDistricts(data?.data || []);
    };
    if (!sameAddress) getDistricts();
  }, [permDivisions, permanent?.division, sameAddress]);
  // Present address: upozillas
  useEffect(() => {
    if (demoDistricts.length === 0) return;
    const selectedDistrict = demoDistricts.find(
      (dist) => dist?.name === present?.district
    );
    const getUpozillas = async () => {
      if (!selectedDistrict) return setDemoUpozillas([]);
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/upazilla/${selectedDistrict?.id}`
      );
      const data = await res.json();
      setDemoUpozillas(data?.data || []);
    };
    getUpozillas();
  }, [demoDistricts, present?.district]);

  // Permanent address: upozillas
  useEffect(() => {
    if (permDistricts.length === 0) return;
    const selectedDistrict = permDistricts.find(
      (dist) => dist?.name === permanent?.district
    );
    const getUpozillas = async () => {
      if (!selectedDistrict) return setPermUpozillas([]);
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/upazilla/${selectedDistrict?.id}`
      );
      const data = await res.json();
      setPermUpozillas(data?.data || []);
    };
    if (!sameAddress) getUpozillas();
  }, [permDistricts, permanent?.district, sameAddress]);

  // Present address: unions
  useEffect(() => {
    const getUnions = async () => {
      if (demoUpozillas.length === 0) return;
      const selectedUpozilla = demoUpozillas.find(
        (up) => up?.name === present?.upozilla
      );
      if (!selectedUpozilla) return setDemoUnions([]);
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/union/${selectedUpozilla?.id}`
      );
      const data = await res.json();
      setDemoUnions(data?.data || []);
    };
    getUnions();
  }, [demoUpozillas, present?.upozilla]);

  // Permanent address: unions
  useEffect(() => {
    const getUnions = async () => {
      if (permUpozillas.length === 0) return;
      const selectedUpozilla = permUpozillas.find(
        (up) => up?.name === permanent?.upozilla
      );
      if (!selectedUpozilla) return setPermUnions([]);
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/union/${selectedUpozilla?.id}`
      );
      const data = await res.json();
      setPermUnions(data?.data || []);
    };
    if (!sameAddress) getUnions();
  }, [permUpozillas, permanent?.upozilla, sameAddress]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        willingToDonate:
          typeof data.willingToDonate === "string"
            ? data.willingToDonate === "true"
              ? true
              : false
            : !!data.willingToDonate,
      };
      console.log("Submitting data:", payload);
      const res = await axiosSecure.put(`/users/profile/${id}`, payload);
      if (res.data?.success) {
        Swal.fire("Success", "Profile updated successfully", "success");
        router.push("/dashboard/profile");
      } else {
        Swal.fire("Error", res.data?.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire(
        "Error",
        error instanceof Error ? error.message : "Something went wrong",
        "error"
      );
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
      className="card bg-base-100 shadow-xl border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-body">
        <h2 className="card-title">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm opacity-70">
              <FiUser />
              <span>Personal</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className="input input-bordered w-full"
                />
                {errors.fullName && (
                  <span className="label-text-alt text-error">
                    {String(errors.fullName.message)}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  readOnly
                  {...register("email", { required: "Email is required" })}
                  className="input input-bordered w-full"
                />
                {errors.email && (
                  <span className="label-text-alt text-error">
                    {String(errors.email.message)}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  {...register("phone")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  {...register("gender")}
                  className="select select-bordered w-full"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Weight (kg)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Donation Preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm opacity-70">
              <FiDroplet />
              <span>Donation preferences</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Blood Group</span>
                </label>
                <input
                  readOnly
                  {...register("bloodGroup")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Willing to Donate?</span>
                </label>
                <select
                  {...register("willingToDonate")}
                  className="select select-bordered w-full"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm opacity-70">
              <FiMapPin />
              <span>Location</span>
            </div>
            {/* Checkbox for same address */}
            <div className="form-control mb-2">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={sameAddress}
                  onChange={(e) => setSameAddress(e.target.checked)}
                />
                <span className="label-text">
                  Present and Permanent Address are the same
                </span>
              </label>
            </div>
            {/* Present Address */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-3">Present Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bangladesh"
                    {...register("location.presentAddress.country")}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Division</span>
                  </label>
                  <select
                    {...register("location.presentAddress.division")}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select</option>
                    {demoDivisions &&
                      demoDivisions.map((div) => (
                        <option key={div?.id} value={div?.name}>
                          {div?.bn_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">District</span>
                  </label>
                  <select
                    {...register("location.presentAddress.district")}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select</option>
                    {demoDistricts &&
                      demoDistricts.map((dis) => (
                        <option key={dis?.id} value={dis?.name}>
                          {dis?.bn_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Upozilla</span>
                  </label>
                  <select
                    {...register("location.presentAddress.upozilla")}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select</option>
                    {demoUpozillas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Union</span>
                  </label>
                  <select
                    {...register("location.presentAddress.union")}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select</option>
                    {demoUnions.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Street</span>
                  </label>
                  <input
                    type="text"
                    {...register("location.presentAddress.street")}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">House No.</span>
                  </label>
                  <input
                    type="text"
                    {...register("location.presentAddress.houseNumber")}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Postal Code</span>
                  </label>
                  <input
                    type="text"
                    {...register("location.presentAddress.postalCode")}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-3">Permanent Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bangladesh"
                    {...register("location.permanentAddress.country")}
                    className="input input-bordered w-full"
                    disabled={sameAddress}
                  />
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Division</span>
                  </label>
                  <select
                    {...register("location.permanentAddress.division")}
                    className="select select-bordered w-full"
                    disabled={sameAddress}
                  >
                    <option value="">Select</option>
                    {permDivisions.map((d) => (
                      <option key={d?.id} value={d?.name}>
                        {d?.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">District</span>
                  </label>
                  <select
                    {...register("location.permanentAddress.district")}
                    className="select select-bordered w-full"
                    disabled={sameAddress}
                  >
                    <option value="">Select</option>
                    {permDistricts.map((d) => (
                      <option key={d?.id} value={d?.name}>
                        {d?.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Upozilla</span>
                  </label>
                  <select
                    {...register("location.permanentAddress.upozilla")}
                    className="select select-bordered w-full"
                    disabled={sameAddress}
                  >
                    <option value="">Select</option>
                    {permUpozillas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Union</span>
                  </label>
                  <select
                    {...register("location.permanentAddress.union")}
                    className="select select-bordered w-full"
                    disabled={sameAddress}
                  >
                    <option value="">Select</option>
                    {permUnions.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.bn_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Street</span>
                  </label>
                  <input
                    type="text"
                    {...register("location.permanentAddress.street")}
                    className="input input-bordered w-full"
                    disabled={sameAddress}
                  />
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">House No.</span>
                  </label>
                  <input
                    type="text"
                    {...register("location.permanentAddress.houseNumber")}
                    className="input input-bordered w-full"
                    disabled={sameAddress}
                  />
                </div>
                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text">Postal Code</span>
                  </label>
                  <input
                    type="text"
                    {...register("location.permanentAddress.postalCode")}
                    className="input input-bordered w-full"
                    disabled={sameAddress}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm opacity-70">
              <FiShield />
              <span>Emergency Contact</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Emergency Name</span>
                </label>
                <input
                  type="text"
                  {...register("emergencyContact.name")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Emergency Phone</span>
                </label>
                <input
                  type="text"
                  {...register("emergencyContact.phone")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Relationship</span>
                </label>
                <input
                  type="text"
                  {...register("emergencyContact.relationship")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Donation Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm opacity-70">
              <FiDroplet />
              <span>Donation Info</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Donation Place</span>
                </label>
                <input
                  type="text"
                  {...register("lastDonationDate.place")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Donation Date</span>
                </label>
                <input
                  type="date"
                  {...register("lastDonationDate.date")}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Verification Document</span>
                </label>
                <input
                  type="text"
                  {...register("lastDonationDate.verificationDocument")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
