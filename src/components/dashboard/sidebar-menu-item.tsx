import * as Icon from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, FC, SetStateAction } from "react";

interface MenuItem {
    name: string;
    icon: string;
    path: string;
}

interface SideBarMenuItemProps {
    menu: MenuItem;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const SideBarMenuItem: FC<SideBarMenuItemProps> = ({ menu, setSidebarOpen }) => {
    const { name, icon, path } = menu;
    const IconComponent = Icon[icon as keyof typeof Icon] as FC<{
        size?: number;
    }>;
    const pathname = usePathname();
    return (
        <li className="py-0.5">
            <Link
                href={path}
                className={`sideLink ${pathname == path && "sideLinkActive"}`}
                onClick={()=>setSidebarOpen(false)}
            >
                {IconComponent && <IconComponent size={18} />}
                {name}
            </Link>
        </li>
    );
};

export default SideBarMenuItem;
