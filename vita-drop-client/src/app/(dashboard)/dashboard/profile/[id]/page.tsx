import EditUserForm from "@/app/(dashboard)/_components/EditUserForm";
import Link from "next/link";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
interface ProfilePageProps {
  params: {
    id: string;
  };
}
export default async function EditProfilePage({ params }: ProfilePageProps) {
  const { id } = params;
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-6">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 mb-4">
        <Link href="/dashboard/profile" className="btn btn-ghost btn-sm">
          <FiArrowLeft className="me-1" /> Back to Profile
        </Link>
      </div>

      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <FiEdit />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">Edit Profile</h1>
          <p className="text-sm opacity-70">
            Update your personal and donation information
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1">
        <EditUserForm id={id} />
      </div>
    </div>
  );
}
