import { getCurrentUser } from "@services/auth";
import Sidebar from "@modules/layout/sidebar";
import Header from "@modules/layout/header";
import MobileNav from "@modules/layout/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="hidden lg:block">
        <Sidebar currentUser={currentUser} />
      </div>
      <div className="block lg:hidden">
        <Header currentUser={currentUser} />
      </div>
      <main className="flex-1 w-full pb-16 lg:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
