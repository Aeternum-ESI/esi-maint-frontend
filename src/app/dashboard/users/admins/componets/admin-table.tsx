"use client";

import { Input } from "@/components/ui/input";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { User } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

export const AdminTable = ({ admins }: { admins: User[] }) => {
    const [search, setSearch] = useState("");

    const filteredAdmins = admins.filter((admin) => admin.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <div className="p-4 flex justify-end">
                <Input
                    placeholder="Rechercher un admin"
                    value={search}
                    className="w-96"
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </div>
            <Table className="w-[calc(100%-2rem)] mx-auto ">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom </TableHead>
                        <TableHead className="max-lg:hidden">Email</TableHead>
                        <TableHead className="max-sm:hidden">Role</TableHead>
                        <TableHead className="max-lg:hidden">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAdmins.map((user) => (
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
