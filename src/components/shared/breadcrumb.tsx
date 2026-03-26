"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
    const pathname = usePathname();

    const pathnames = pathname.split("/").filter((x) => x);

    return (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            {pathnames.map((value, index) => {
                const currentPath = `/${pathnames
                    .slice(0, index + 1)
                    .join("/")}`;
                const isLast = index === pathnames.length - 1;

                return isLast ? (
                    <span key={index} className="flex items-center space-x-2">
                        <span>/</span>
                        <span className="capitalize text-foreground font-medium">
                            {value.replace(/-/g, " ")}
                        </span>
                    </span>
                ) : (
                    <span key={index} className="flex items-center space-x-2">
                        {currentPath !== "/dashboard" && <span>/</span>}
                        <Link
                            href={currentPath}
                            className="capitalize hover:text-foreground transition-colors"
                        >
                            {value.replace(/-/g, " ")}
                        </Link>
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
