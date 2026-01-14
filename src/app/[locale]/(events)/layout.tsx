import Sidebar from "@modules/layout/sidebar";

export default function EventsGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-neutral-white">
        {children}
      </main>
    </div>
  );
}
