import AuthNavbar from "./_components/AuthNavbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <AuthNavbar />
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
