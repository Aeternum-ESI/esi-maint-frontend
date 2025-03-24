import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Auth } from "@better-fetch/fetch";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "../actions/get-user";
import { AppSidebar } from "./components/AppSideBar";
import { NavUser } from "./components/nav-user";
import { Notifications } from "./components/notifications";
import { PathBreadCrumb } from "./components/path-bradcrumb";
import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    if (user.role === "STAFF") {
        redirect("/");
    }

    return (
        <SidebarProvider>
            {user.approvalStatus === "VALIDATED" && <AppSidebar />}
            <SidebarInset>
                <header className="flex h-16 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
                    {user.approvalStatus === "VALIDATED" && (
                        <div className="flex items-center gap-2 px-4 w-full ">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <PathBreadCrumb />
                        </div>
                    )}
                    <div className="w-fit flex gap-4 items-center mr-12">
                        <NavUser user={user} />
                        <Notifications />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
