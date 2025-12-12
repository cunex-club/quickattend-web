import { Link } from "@i18n/navigation";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";

type SidebarNavigationProps = {
  children: React.ReactNode;
  href: string;
};

const SidebarNavigation: StyleableFC<SidebarNavigationProps> = ({ children, href, className }) => {

  return (
    <Link
      href={href}
      className={cn(className)}
    >
      {children}
    </Link>
  );
};

export default SidebarNavigation;
