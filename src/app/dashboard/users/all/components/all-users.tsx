"use client";
import { changeRole } from "@/app/actions/change-role";
import { validate } from "@/app/actions/validate.action";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";
import { RadioGroup } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { CheckSquare2, Edit2, Filter, XSquareIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

export const AllUsers = ({ users }: { users: User[] }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "STAFF" | "TECHNICIAN">("ALL");

    // Debounce effect - only update filter after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timer);
    }, [search]);

    const filteredUsers = users.filter((user) => {
        const roleMatch = roleFilter === "ALL" || user.role === roleFilter;
        const searchMatch = user.name.toLowerCase().includes(debouncedSearch.toLowerCase());

        return roleMatch && searchMatch;
    });

    return (
        <>
            <div className="flex justify-end gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56" align="end">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filtrer par rôle</h4>
                            <div className="flex flex-col space-y-1 pt-2">
                                <RadioGroup
                                    value={roleFilter}
                                    onValueChange={(value: "ALL" | "TECHNICIAN" | "ADMIN" | "ALL") =>
                                        setRoleFilter(value)
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ALL" id="all" />
                                        <Label htmlFor="all">Tous</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ADMIN" id="admin" />
                                        <Label htmlFor="admin">Admin</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="STAFF" id="staff" />
                                        <Label htmlFor="staff">Staff</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="TECHNICIAN" id="technician" />
                                        <Label htmlFor="technician">Technicien</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Input
                    placeholder="Rechercher un admin"
                    value={search}
                    className="w-96"
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </div>
            <Table className="w-[calc(100%-2rem)] mx-auto h-full ">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom </TableHead>
                        <TableHead className="max-lg:hidden">Email</TableHead>
                        <TableHead className="max-sm:hidden">Role</TableHead>
                        <TableHead className="max-lg:hidden">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={user.avatarUrl}
                                        width={100}
                                        height={100}
                                        alt=""
                                        className="size-8 rounded-full"
                                    />
                                    {user.name}
                                </div>
                            </TableCell>
                            <TableCell className="max-lg:hidden">{user.email}</TableCell>
                            <TableCell className="max-sm:hidden">
                                <Select
                                    defaultValue={user.role}
                                    onValueChange={(role: "ADMIN" | "STAFF" | "TECHNICIAN") =>
                                        changeRole(user.id, role)
                                    }
                                >
                                    <SelectTrigger className="w-42  border-none shadow-none hover:bg-muted">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="STAFF">Staff</SelectItem>
                                            <SelectItem value="TECHNICIAN">Technicien</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="max-lg:hidden">{user.approvalStatus}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Edit2 className="mr-1" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-fit mr-4">
                                        <DropdownMenuItem variant="destructive">Désactiver</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export const ValidateUsers = ({ users }: { users: User[] }) => {
    return (
        <>
            <Table className="w-[calc(100%-2rem)] mx-auto h-full ">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom </TableHead>
                        <TableHead className="max-lg:hidden">Email</TableHead>
                        <TableHead className="max-sm:hidden">Role</TableHead>
                        <TableHead className="max-lg:hidden">Status</TableHead>
                        <TableHead className="text-right">Valider</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={user.avatarUrl}
                                        width={100}
                                        height={100}
                                        alt=""
                                        className="size-8 rounded-full"
                                    />
                                    {user.name}
                                </div>
                            </TableCell>
                            <TableCell className="max-lg:hidden">{user.email}</TableCell>
                            <TableCell className="max-sm:hidden">{user.role}</TableCell>
                            <TableCell className="max-lg:hidden">{user.approvalStatus}</TableCell>
                            <TableCell className="gap-2 flex" dir="rtl">
                                <XSquareIcon
                                    color="red"
                                    size={32}
                                    onClick={() => {
                                        validate(user.id, false);
                                    }}
                                />
                                <CheckSquare2
                                    color="green"
                                    size={32}
                                    onClick={() => {
                                        validate(user.id, true);
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
