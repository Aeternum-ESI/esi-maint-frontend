"use client";

import { LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types";
import { useRouter } from "next/navigation";

export function NavUser({ user }: { user: User }) {
    const router = useRouter();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer">
                        <Avatar className="h-8 w-8 rounded-lg grayscale">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="rounded-lg">
                                {user.name
                                    .split(" ")
                                    .map((e) => e[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                        <MoreVerticalIcon className="ml-auto size-4" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
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
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <UserCircleIcon />
                            Account
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/logout")}>
                        <LogOutIcon />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
