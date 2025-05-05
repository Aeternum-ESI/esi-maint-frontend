"use client";

import * as React from "react";
import { BookOpen, Building2, GalleryVerticalEnd, LayoutDashboard, TriangleAlert, User } from "lucide-react";

import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";

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
            url: "Planifier",
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" className="" {...props}>
            <NavHeader />
            <SidebarContent className=" font-base">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>Logout</SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
