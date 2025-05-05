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

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUser();
    return (
        <>
            <header className="flex h-16 shrink-0 w-full items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-isabelline  ">
                {user.approvalStatus === "VALIDATED" && (
                    <div className="flex items-center gap-2 px-4 w-full ">
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <PathBreadCrumb />
                    </div>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserCircleIcon />
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
