import { RoleProvider } from "@context/RoleContext";
import { getUserRole } from "@lib/auth";
import { DashboardSidebar } from "@components/dashboard/DashboardSidebar";
import { getCurrentUser } from "@services/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, currentUser] = await Promise.all([
    getUserRole(),
    getCurrentUser(),
  ]);

  return (
    <RoleProvider initialRole={role}>
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        <DashboardSidebar currentUser={currentUser} />
        <main className="flex-1 w-full pb-16 lg:pb-0">{children}</main>
      </div>
    </RoleProvider>
  );
}
