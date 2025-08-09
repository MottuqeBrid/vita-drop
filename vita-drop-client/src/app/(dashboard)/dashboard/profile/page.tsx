"use client";
import axiosSecure from "@/lib/axiosSecure";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiDroplet,
  FiCalendar,
  FiCamera,
  FiCheck,
  FiUser,
} from "react-icons/fi";
import { uploadImage } from "@/lib/uploadImage";

interface User {
  _id: string;
  fullName: string;
  email: string;
  photo: {
    profilePhoto?: string;
    coverPhoto?: string;
  };
  role?: string;
  createdAt?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  bloodGroup?: string;
  weight?: number;
  isAvailable?: boolean;
  willingToDonate?: boolean;
  isEligible?: boolean;
  numberOfDonations?: number;
  nextDonationDate?: string;
  location?: {
    presentAddress?: string;
    permanentAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  lastDonationDate?: {
    date?: string;
    place?: string;
    bloodGroup?: string;
    verificationDocument?: string;
  };
  isActive?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  termsConditions?: boolean;
  account?: {
    ban?: boolean;
    suspended?: boolean;
    deactivated?: boolean;
    reason?: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<null | User>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Cover photo upload state
  const [isCoverUploadOpen, setIsCoverUploadOpen] = useState(false);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  useEffect(() => {
    userProfile();
  }, []);

  const userProfile = async () => {
    try {
      const res = await axiosSecure.get("/users/profile");
      if (res.data?.success) setUser(res.data.user);
      else console.warn(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const openUploadModal = () => {
    setUploadError(null);
    setIsUploadOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadOpen(false);
    setUploadError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setUploadError(null);
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const onUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select an image.");
      return;
    }
    try {
      console.log("Uploading file:", selectedFile);
      setUploading(true);
      setUploadError(null);
      const data = await uploadImage(selectedFile);

      const res = await axiosSecure.put(`/users/profile/${user?._id}`, {
        photo: { ...user?.photo, profilePhoto: data?.url },
      });

      console.log("Upload response:", res);

      const newUrl = data?.user?.photo?.profilePhoto || data?.url;
      if (newUrl) {
        setUser((prev) =>
          prev
            ? { ...prev, photo: { ...prev.photo, profilePhoto: newUrl } }
            : prev
        );
      } else if (res?.data?.user) {
        setUser(res?.data?.user);
      }
      closeUploadModal();
    } catch (err: unknown) {
      type AxiosLikeError = { response?: { data?: { message?: string } } };
      const maybeAxios = err as AxiosLikeError;
      const msg =
        maybeAxios?.response?.data?.message ||
        (err instanceof Error ? err.message : "Upload failed");
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  // Cover photo handlers
  const openCoverUploadModal = () => {
    setCoverUploadError(null);
    setIsCoverUploadOpen(true);
  };

  const closeCoverUploadModal = () => {
    setIsCoverUploadOpen(false);
    setCoverUploadError(null);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(null);
    setSelectedCoverFile(null);
  };

  const onCoverFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCoverUploadError(null);
    const file = e.target.files?.[0] || null;
    setSelectedCoverFile(file);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    if (file) setCoverPreviewUrl(URL.createObjectURL(file));
    else setCoverPreviewUrl(null);
  };

  const onCoverUpload = async () => {
    if (!selectedCoverFile) {
      setCoverUploadError("Please select an image.");
      return;
    }
    try {
      setCoverUploading(true);
      setCoverUploadError(null);

      // Reuse the same upload endpoint; backend should detect the field name
      const res = await uploadImage(selectedCoverFile);
      const newUrl = res?.url;
      console.log("Cover upload response:", res);
      const newData = await axiosSecure.put(`/users/profile/${user?._id}`, {
        photo: { ...user?.photo, coverPhoto: newUrl },
      });
      console.log("Cover upload response:", newData);
      if (newUrl) {
        setUser((prev) =>
          prev
            ? { ...prev, photo: { ...prev.photo, coverPhoto: newUrl } }
            : prev
        );
      } else if (newData?.data?.user) {
        setUser(newData?.data?.user);
      }
      closeCoverUploadModal();
    } catch (err: unknown) {
      type AxiosLikeError = { response?: { data?: { message?: string } } };
      const maybeAxios = err as AxiosLikeError;
      const msg =
        maybeAxios?.response?.data?.message ||
        (err instanceof Error ? err.message : "Upload failed");
      setCoverUploadError(msg);
    } finally {
      setCoverUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  return (
    <motion.div
      className="bg-base-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cover banner */}
      <div className="relative w-full h-40 md:h-56 bg-gradient-to-r from-primary/70 to-secondary/70">
        <Image
          src={user?.photo?.coverPhoto || "https://i.pravatar.cc/12000"}
          alt="Cover Photo"
          fill
          className="object-cover w-full h-full"
          style={{ zIndex: 1 }}
          priority
        />
        {/* Cover camera button */}
        <button
          type="button"
          aria-label="Change cover photo"
          onClick={openCoverUploadModal}
          className="absolute bottom-3 right-3 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/70"
        >
          <FiCamera className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Profile card */}
          <div className="md:col-span-4">
            <div className="card bg-base-100 shadow-xl border md:sticky md:top-20">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="avatar">
                      <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden">
                        <Image
                          src={
                            user?.photo?.profilePhoto ||
                            "https://i.pravatar.cc/120"
                          }
                          alt="Profile photo"
                          width={112}
                          height={112}
                          className="object-cover w-28 h-28"
                          priority
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Change profile photo"
                      onClick={openUploadModal}
                      className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white shadow-md hover:brightness-105"
                    >
                      <FiCamera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h2 className="card-title leading-tight break-words">
                      {user?.fullName || "User"}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="badge badge-outline badge-primary">
                        {user?.role || "Member"}
                      </span>
                      <span className="text-xs opacity-70">
                        Joined{" "}
                        {user?.createdAt
                          ? formatDistance(
                              new Date(user.createdAt),
                              new Date(),
                              { addSuffix: true }
                            )
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FiMail className="text-primary" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiPhone className="text-primary" />
                    <span>{user?.phone || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiMapPin className="text-primary" />
                    <span className="truncate">
                      {user?.location?.city || ""}
                      {user?.location?.city &&
                        (user?.location?.country ? ", " : "")}
                      {user?.location?.country || ""}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 stats stats-vertical shadow-sm w-full">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <FiDroplet />
                    </div>
                    <div className="stat-title">Donations</div>
                    <div className="stat-value text-primary">
                      {user?.numberOfDonations ?? 0}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <FiCalendar />
                    </div>
                    <div className="stat-title">Next Donation</div>
                    <div className="stat-desc">
                      {user?.nextDonationDate
                        ? new Date(user.nextDonationDate).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/profile/${user?._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit Profile
                  </Link>
                  <span
                    className={`badge ${
                      user?.isAvailable ? "badge-success" : "badge-neutral"
                    }`}
                  >
                    {user?.isAvailable
                      ? "Available to Donate"
                      : "Not Available"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Personal Information */}
              <div className="card bg-base-100 shadow-xl border">
                <div className="card-body">
                  <h3 className="card-title">
                    <FiUser />
                    Personal Information
                  </h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Gender:</span>
                      <span>{user?.gender || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Date of Birth:</span>
                      <span>
                        {user?.dateOfBirth
                          ? new Date(user.dateOfBirth).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Age:</span>
                      <span>{user?.age ?? "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Blood Group:</span>
                      <span className="badge badge-outline">
                        {user?.bloodGroup || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Weight (kg):</span>
                      <span>{user?.weight ?? "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Willing to Donate:</span>
                      <span
                        className={`badge ${
                          user?.willingToDonate
                            ? "badge-success"
                            : "badge-neutral"
                        }`}
                      >
                        {user?.willingToDonate ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Eligible:</span>
                      <span
                        className={`badge ${
                          user?.isEligible ? "badge-success" : "badge-neutral"
                        }`}
                      >
                        {user?.isEligible ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="card bg-base-100 shadow-xl border">
                <div className="card-body">
                  <h3 className="card-title">
                    <FiMapPin />
                    Location
                  </h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    {/* Present Address */}
                    <div>
                      <span className="font-medium block mb-1">
                        Present Address:
                      </span>
                      <div className="space-y-1">
                        <div>
                          <span className="font-semibold">Country:</span>{" "}
                          {user?.location?.presentAddress?.country || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">District:</span>{" "}
                          {user?.location?.presentAddress?.district || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Upozilla:</span>{" "}
                          {user?.location?.presentAddress?.upozilla || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Union:</span>{" "}
                          {user?.location?.presentAddress?.union || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Street:</span>{" "}
                          {user?.location?.presentAddress?.street || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">House No.:</span>{" "}
                          {user?.location?.presentAddress?.houseNumber || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Postal Code:</span>{" "}
                          {user?.location?.presentAddress?.postalCode || "-"}
                        </div>
                      </div>
                    </div>
                    {/* Permanent Address */}
                    <div>
                      <span className="font-medium block mb-1">
                        Permanent Address:
                      </span>
                      <div className="space-y-1">
                        <div>
                          <span className="font-semibold">Country:</span>{" "}
                          {user?.location?.permanentAddress?.country || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">District:</span>{" "}
                          {user?.location?.permanentAddress?.district || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Upozilla:</span>{" "}
                          {user?.location?.permanentAddress?.upozilla || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Union:</span>{" "}
                          {user?.location?.permanentAddress?.union || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Street:</span>{" "}
                          {user?.location?.permanentAddress?.street || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">House No.:</span>{" "}
                          {user?.location?.permanentAddress?.houseNumber || "-"}
                        </div>
                        <div>
                          <span className="font-semibold">Postal Code:</span>{" "}
                          {user?.location?.permanentAddress?.postalCode || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card bg-base-100 shadow-xl border">
                <div className="card-body">
                  <h3 className="card-title">
                    <FiPhone />
                    Emergency Contact
                  </h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {user?.emergencyContact?.name && (
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {user.emergencyContact.name}
                      </div>
                    )}
                    {user?.emergencyContact?.phone && (
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {user.emergencyContact.phone}
                      </div>
                    )}
                    {user?.emergencyContact?.relationship && (
                      <div>
                        <span className="font-medium">Relationship:</span>{" "}
                        {user.emergencyContact.relationship}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Last Donation */}
              <div className="card bg-base-100 shadow-xl border">
                <div className="card-body">
                  <h3 className="card-title">
                    <FiDroplet />
                    Last Donation
                  </h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {user?.lastDonationDate?.date && (
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(
                          user.lastDonationDate.date
                        ).toLocaleDateString()}
                      </div>
                    )}
                    {user?.lastDonationDate?.place && (
                      <div>
                        <span className="font-medium">Place:</span>{" "}
                        {user.lastDonationDate.place}
                      </div>
                    )}
                    {user?.lastDonationDate?.bloodGroup && (
                      <div>
                        <span className="font-medium">Blood Group:</span>{" "}
                        {user.lastDonationDate.bloodGroup}
                      </div>
                    )}
                    {user?.lastDonationDate?.verificationDocument && (
                      <div className="truncate">
                        <span className="font-medium">Verification:</span>{" "}
                        {user.lastDonationDate.verificationDocument}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="card bg-base-100 shadow-xl border">
                <div className="card-body">
                  <h3 className="card-title">
                    <FiCheck />
                    Account Status
                  </h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Active:</span>
                      {user.isActive ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-neutral">No</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email Verified:</span>
                      {user.emailVerified ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-neutral">No</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Phone Verified:</span>
                      {user.phoneVerified ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-neutral">No</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Accepted Terms:</span>
                      {user.termsConditions ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-neutral">No</span>
                      )}
                    </div>
                    {user.account?.ban && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Banned:</span>
                        <span className="badge badge-error">Yes</span>
                      </div>
                    )}
                    {user.account?.suspended && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Suspended:</span>
                        <span className="badge badge-warning">Yes</span>
                      </div>
                    )}
                    {user.account?.deactivated && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Deactivated:</span>
                        <span className="badge badge-neutral">Yes</span>
                      </div>
                    )}
                    {user.account?.reason && (
                      <div className="sm:col-span-2">
                        <span className="font-medium">Reason:</span>{" "}
                        {user.account.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Upload modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeUploadModal}
          />
          <div className="relative z-10 w-11/12 max-w-md rounded-xl bg-base-100 shadow-xl border p-5">
            <h3 className="text-lg font-semibold mb-3">Update Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <Image
                  src={
                    previewUrl ||
                    user.photo?.profilePhoto ||
                    "https://i.pravatar.cc/120"
                  }
                  alt="Preview"
                  fill
                  className="rounded-full object-cover border"
                />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:cursor-pointer text-sm"
                />
                {uploadError && (
                  <p className="text-error text-sm mt-2">{uploadError}</p>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary disabled:opacity-60"
                onClick={onUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isCoverUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeCoverUploadModal}
          />
          <div className="relative z-10 w-11/12 max-w-3xl max-h-screen rounded-xl bg-base-100 shadow-xl border p-5 overflow-scroll">
            <h3 className="text-lg font-semibold mb-3">Update Cover Photo</h3>
            <div className="space-y-4">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg border">
                <Image
                  src={
                    coverPreviewUrl ||
                    user.photo?.coverPhoto ||
                    "/default-cover.jpg"
                  }
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 800px"
                  priority
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onCoverFileChange}
                  className="file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:cursor-pointer text-sm w-full"
                />
              </div>
              {coverUploadError && (
                <p className="text-error text-sm">{coverUploadError}</p>
              )}
              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeCoverUploadModal}
                  disabled={coverUploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary disabled:opacity-60"
                  onClick={onCoverUpload}
                  disabled={coverUploading}
                >
                  {coverUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
