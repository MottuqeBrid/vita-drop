import EditUserForm from "@/app/(dashboard)/_components/EditUserForm";

export default async function EditProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 px-2">
      <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Edit Profile
      </h1>
      <div className="w-full max-w-md">
        <EditUserForm id={id} />
      </div>
    </div>
  );
}
