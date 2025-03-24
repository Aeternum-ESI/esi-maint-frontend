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
            title: "Signalements",
            url: "dashboard/reports",
            icon: TriangleAlert,
        },
        {
            title: "Utilisateurs",
            url: "dashboard/users",
            icon: User,
            collapsible: true,
            items: [
                {
                    title: "Tous",
                    url: "all",
                },
                {
                    title: "Administrateurs",
                    url: "admins",
                },
                {
                    title: "Techniciens",
                    url: "technicians",
                },
            ],
        },
        {
            title: "Planifier",
            url: "dashboard/schedule",
            icon: BookOpen,
            collapsible: false,
        },
        {
            title: "Assets",
            url: "dashboard/assets",
            icon: Building2,
            collapsible: false,
        },
        {
            title: "Categories",
            url: "dashboard/categories",
            icon: GalleryVerticalEnd,
            collapsible: false,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <NavHeader />
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>Logout</SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
