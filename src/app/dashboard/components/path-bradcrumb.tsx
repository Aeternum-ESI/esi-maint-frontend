"use client";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export const PathBreadCrumb = () => {
    const pathname = usePathname().split("/").filter(Boolean);

    const paths = pathname.map((path, index) => {
        const url = `/${pathname.slice(0, index + 1).join("/")}`;
        return {
            path,
            url,
        };
    });

    // Display logic: first item, dropdown for middle items if many, and last item
    const showDropdown = paths.length > 3;

    return (
        <>
            <Breadcrumb className="capitalize">
                <BreadcrumbList>
                    {/* Always show first item */}
                    {paths.length > 0 && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={paths[0].url}>{paths[0].path}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )}

                    {/* Dropdown for middle items if path is long */}
                    {showDropdown && paths.length > 2 && (
                        <>
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                        <span className="sr-only">More pages</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {paths.slice(1, -1).map((path, i) => (
                                            <DropdownMenuItem key={i}>
                                                <BreadcrumbLink href={path.url}>{path.path}</BreadcrumbLink>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )}

                    {/* Display intermediate paths if not using dropdown */}
                    {!showDropdown &&
                        paths.slice(1, -1).map((path, i) => (
                            <BreadcrumbItem key={i}>
                                <BreadcrumbLink href={path.url}>{path.path}</BreadcrumbLink>
                                <BreadcrumbSeparator />
                            </BreadcrumbItem>
                        ))}

                    {/* Always show last item as current page */}
                    {paths.length > 0 && (
                        <BreadcrumbItem>
                            <BreadcrumbPage>{paths[paths.length - 1].path}</BreadcrumbPage>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </>
    );
};
