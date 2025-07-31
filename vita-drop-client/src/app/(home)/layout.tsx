import Navbar from "@/components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">{children}</div>
    </section>
  );
}
