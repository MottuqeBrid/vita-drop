import DashboardNavbar from "./_components/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-base-100">
      <DashboardNavbar />
      <div className="-z-10 max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
