"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Building2, GalleryVerticalEnd, LayoutDashboard, Settings, TriangleAlert, User } from "lucide-react";

import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import Link from "next/link";

// This is sample data.
const data = {
    navMain: [
        {
            collapsible: false,
            title: "Overview",
            url: "/dashboard/overview",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            collapsible: false,
            title: "Reports",
            url: "/dashboard/reports",
            icon: TriangleAlert,
        },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: User,
            collapsible: true,
            items: [
                {
                    title: "All",
                    url: "/dashboard/users/all",
                },
                {
                    title: "Administrators",
                    url: "/dashboard/users/admins",
                },
                {
                    title: "Technicians",
                    url: "/dashboard/users/technicians",
                },
            ],
        },
        {
            title: "Schedule",
            url: "/dashboard/planifier",
            icon: BookOpen,
            collapsible: false,
        },
        {
            title: "Assets",
            url: "/dashboard/assets",
            icon: Building2,
            collapsible: false,
        },
    ],
    navFooter: [
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
            className: "text-gray-600 hover:text-persian-green"
        },
        {
            title: "Logout",
            url: "/logout",
            icon: null,
            className: "text-red-500 hover:underline"
        }
    ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();

    // Handle special navigation cases like logout
    const handleNavigation = (url: string) => {
        if (url === "/logout") {
            // Clear the authentication token
            localStorage.removeItem("access_token");
            // Redirect to the login page
            router.push("/login");
        }
    };

    return (
        <Sidebar collapsible="icon" className="" {...props}>
            <NavHeader />
            <SidebarContent className="font-base">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <div className="flex gap-4 items-center justify-between px-2">
                    {data.navFooter.map((item, index) => (
                        <Link 
                            href={item.url}
                            key={index}
                            className={`flex items-center ${item.className}`}
                            
                        >
                            {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
