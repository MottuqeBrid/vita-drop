import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex flex-col justify-between bg-base-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">{children}</div>
      <Footer />
    </section>
  );
}
