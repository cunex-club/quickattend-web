import { getCurrentUser } from "@services/auth";

import SidebarClient from "@modules/layout/sidebar/components/sidebar-client";

type SidebarProps = {
  currentUser?: Awaited<ReturnType<typeof getCurrentUser>>;
};

const Sidebar = async ({ currentUser }: SidebarProps) => {
  const user = currentUser === undefined ? await getCurrentUser() : currentUser;

  return <SidebarClient currentUser={user} />;
};

export default Sidebar;
