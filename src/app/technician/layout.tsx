import { PathBreadCrumb } from "../dashboard/components/path-bradcrumb";
import { getUser } from "../actions/get-user";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutIcon, UserCircleIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavUser } from "../dashboard/components/nav-user";
import { Notifications } from "../dashboard/components/notifications";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUser();
    return (
        <>
            <header className="flex h-16 px-12 shrink-0 w-full items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-isabelline  ">
                {user.approvalStatus === "VALIDATED" && (
                    <div className="flex items-center gap-2 px-4 w-full ">
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
                <div className="w-full h-full bg-isabelline">{children}</div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 h-full ">
                    <h1 className="text-3xl font-bold">Your account is pending approval</h1>
                    <p className="text-muted-foreground">
                        Your account is pending approval. You will be notified once your account is approved.
                    </p>
                </div>
            )}
        </>
    );
};

export default Layout;
