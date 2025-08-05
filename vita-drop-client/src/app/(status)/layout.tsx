export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
