import { Link, usePathname } from "@i18n/navigation";
import { cn } from "@assets/lib/utils";

type SidebarNavigationProps = {
  pathname: string;
  path: string;
};

const SidebarNavigation = ({ pathname, path }: SidebarNavigationProps) => {
  const isCurrentPath = usePathname().includes(pathname);

  return (
    <Link
      href={pathname}
      className={cn("headline-small-emphasized", {
        "text-primary": isCurrentPath,
      })}
    >
      {path}
    </Link>
  );
};

export default SidebarNavigation;
