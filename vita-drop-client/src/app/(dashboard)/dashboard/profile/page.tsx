"use client";
import axiosSecure from "@/lib/axiosSecure";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
      setUploading(true);
      setUploadError(null);
      const form = new FormData();
      form.append("profilePhoto", selectedFile);
      // Assumption: server accepts multipart/form-data at this endpoint and returns updated user or url
      const res = await axiosSecure.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newUrl = res.data?.user?.photo?.profilePhoto || res.data?.url;
      if (newUrl) {
        setUser((prev) =>
          prev
            ? { ...prev, photo: { ...prev.photo, profilePhoto: newUrl } }
            : prev
        );
      } else if (res.data?.user) {
        setUser(res.data.user);
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
      const form = new FormData();
      form.append("coverPhoto", selectedCoverFile);
      // Reuse the same upload endpoint; backend should detect the field name
      const res = await axiosSecure.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newUrl = res.data?.user?.photo?.coverPhoto || res.data?.url;
      if (newUrl) {
        setUser((prev) =>
          prev
            ? { ...prev, photo: { ...prev.photo, coverPhoto: newUrl } }
            : prev
        );
      } else if (res.data?.user) {
        setUser(res.data.user);
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
      className="max-w-2xl mx-auto mt-8 bg-base-100 rounded-xl shadow-lg border overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Facebook-style cover photo */}
      <div className="relative w-full h-40 md:h-56 bg-gradient-to-r from-primary/70 to-secondary/70">
        <Image
          src={user?.photo?.coverPhoto || "/default-cover.jpg"}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M9 3a1 1 0 0 0-.894.553L7.382 5H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-2.382l-.724-1.447A1 1 0 0 0 14 3H9zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 .002 6.002A3 3 0 0 0 12 10z" />
          </svg>
        </button>
        {/* Update Profile Button */}
        <Link
          href={`/dashboard/profile/${user?._id}`}
          className="absolute top-3 right-3 bg-primary text-white px-4 py-1.5 rounded-lg shadow hover:bg-primary-dark transition z-10 text-sm font-medium"
        >
          Update Profile
        </Link>
        {/* Profile image, overlapping cover */}
        <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="relative group">
            <Image
              src={user?.photo?.profilePhoto || "https://i.pravatar.cc/120"}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full border-4 border-white dark:border-gray-900 shadow-lg object-cover w-32 h-32 bg-gray-100"
              priority
            />
            {/* Camera button like Facebook */}
            <button
              type="button"
              aria-label="Change profile photo"
              onClick={openUploadModal}
              className="absolute bottom-1 right-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/70"
            >
              {/* camera icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M9 3a1 1 0 0 0-.894.553L7.382 5H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-2.382l-.724-1.447A1 1 0 0 0 14 3H9zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 .002 6.002A3 3 0 0 0 12 10z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Main card content */}
      <div className="pt-16 pb-4 px-4 md:px-8 flex flex-col items-center bg-gradient-to-b from-primary/5 via-white to-secondary/5">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 text-center">
          {user?.fullName}
        </h2>
        <span className="text-sm text-primary font-semibold mb-2">
          {user?.role || "-"}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Joined{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "-"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Email:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.email}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Phone:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.phone || "-"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Gender:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.gender || "-"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Date of Birth:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Age:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.age ?? "-"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Blood Group:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.bloodGroup || "-"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Weight (kg):
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.weight ?? "-"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Available to Donate:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.isAvailable ? "Yes" : "No"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Willing to Donate:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.willingToDonate ? "Yes" : "No"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Eligible:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.isEligible ? "Yes" : "No"}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Number of Donations:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.numberOfDonations ?? 0}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="font-medium text-gray-700 dark:text-gray-200">
              Next Donation Date:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {user?.nextDonationDate
                ? new Date(user.nextDonationDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
        </div>
        {/* Location */}
        <div className="mb-6 w-full">
          <div className="font-medium text-primary mb-1">Location</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm flex flex-wrap gap-x-4 gap-y-1">
            {user?.location?.presentAddress && (
              <div>
                Present:{" "}
                <span className="font-medium">
                  {user.location.presentAddress}
                </span>
              </div>
            )}
            {user?.location?.permanentAddress && (
              <div>
                Permanent:{" "}
                <span className="font-medium">
                  {user.location.permanentAddress}
                </span>
              </div>
            )}
            {user?.location?.city && (
              <div>
                City: <span className="font-medium">{user.location.city}</span>
              </div>
            )}
            {user?.location?.state && (
              <div>
                State:{" "}
                <span className="font-medium">{user.location.state}</span>
              </div>
            )}
            {user?.location?.country && (
              <div>
                Country:{" "}
                <span className="font-medium">{user.location.country}</span>
              </div>
            )}
            {user?.location?.postalCode && (
              <div>
                Postal Code:{" "}
                <span className="font-medium">{user.location.postalCode}</span>
              </div>
            )}
          </div>
        </div>
        {/* Emergency Contact */}
        <div className="mb-6 w-full">
          <div className="font-medium text-primary mb-1">Emergency Contact</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm flex flex-wrap gap-x-4 gap-y-1">
            {user?.emergencyContact?.name && (
              <div>
                Name:{" "}
                <span className="font-medium">
                  {user.emergencyContact.name}
                </span>
              </div>
            )}
            {user?.emergencyContact?.phone && (
              <div>
                Phone:{" "}
                <span className="font-medium">
                  {user.emergencyContact.phone}
                </span>
              </div>
            )}
            {user?.emergencyContact?.relationship && (
              <div>
                Relationship:{" "}
                <span className="font-medium">
                  {user.emergencyContact.relationship}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Last Donation */}
        <div className="mb-6 w-full">
          <div className="font-medium text-primary mb-1">Last Donation</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm flex flex-wrap gap-x-4 gap-y-1">
            {user?.lastDonationDate?.date && (
              <div>
                Date:{" "}
                <span className="font-medium">
                  {new Date(user.lastDonationDate.date).toLocaleDateString()}
                </span>
              </div>
            )}
            {user?.lastDonationDate?.place && (
              <div>
                Place:{" "}
                <span className="font-medium">
                  {user.lastDonationDate.place}
                </span>
              </div>
            )}
            {user?.lastDonationDate?.bloodGroup && (
              <div>
                Blood Group:{" "}
                <span className="font-medium">
                  {user.lastDonationDate.bloodGroup}
                </span>
              </div>
            )}
            {user?.lastDonationDate?.verificationDocument && (
              <div>
                Verification:{" "}
                <span className="font-medium">
                  {user.lastDonationDate.verificationDocument}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Account Status */}
        <div className="mb-2 w-full">
          <div className="font-medium text-primary mb-1">Account Status</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm flex flex-wrap gap-x-4 gap-y-1">
            <div>
              Active:{" "}
              <span className="font-medium">
                {user.isActive ? "Yes" : "No"}
              </span>
            </div>
            <div>
              Email Verified:{" "}
              <span className="font-medium">
                {user.emailVerified ? "Yes" : "No"}
              </span>
            </div>
            <div>
              Phone Verified:{" "}
              <span className="font-medium">
                {user.phoneVerified ? "Yes" : "No"}
              </span>
            </div>
            <div>
              Accepted Terms:{" "}
              <span className="font-medium">
                {user.termsConditions ? "Yes" : "No"}
              </span>
            </div>
            {user.account?.ban && (
              <div>
                Banned: <span className="font-medium">Yes</span>
              </div>
            )}
            {user.account?.suspended && (
              <div>
                Suspended: <span className="font-medium">Yes</span>
              </div>
            )}
            {user.account?.deactivated && (
              <div>
                Deactivated: <span className="font-medium">Yes</span>
              </div>
            )}
            {user.account?.reason && (
              <div>
                Reason:{" "}
                <span className="font-medium">{user.account.reason}</span>
              </div>
            )}
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
          <div className="relative z-10 w-11/12 max-w-3xl rounded-xl bg-base-100 shadow-xl border p-5">
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
