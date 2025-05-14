import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { getUser } from "../actions/get-user";
import { AppSidebar } from "./components/AppSideBar";
import { NavUser } from "./components/nav-user";
import { Notifications } from "./components/notifications";
import { PathBreadCrumb } from "./components/path-bradcrumb";


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
                <header className="flex h-16 shrink-0 w-full items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-isabelline  ">
                    {user.approvalStatus === "VALIDATED" && (
                        <div className="flex items-center gap-2 px-4 w-full ">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <PathBreadCrumb />
                        </div>
                    )}
                    <div className="w-fit flex gap-4 items-center mr-12 ml-auto  ">
                        <NavUser user={user} />
                        <Notifications />
                    </div>
                </header>
                {user.approvalStatus === "VALIDATED" ? (
                    <div className="w-full h-full bg-isabelline">
                       
                            {children}
                           
                        </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 h-full ">
                        <h1 className="text-3xl font-bold">Your account is pending approval</h1>
                        <p className="text-muted-foreground">
                            Your account is pending approval. You will be notified once your account is approved.
                        </p>
                    </div>
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
