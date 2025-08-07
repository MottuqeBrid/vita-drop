import DashboardNavbar from "./_components/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex flex-col justify-between bg-base-100">
      <DashboardNavbar />
      <div className="">{children}</div>
    </section>
  );
}
