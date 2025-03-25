import { $fetch } from "@/app/actions/fetch";
import { getToken } from "@/app/getToken";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { User } from "@/lib/types";

import Image from "next/image";
import { AdminTable } from "./componets/admin-table";
import { Card } from "@/components/ui/card";

async function Page() {
    const { data } = await $fetch("users", {
        auth: await getToken(),
    });

    const users: User[] = data?.data;

    const admins = users.filter((user) => user.role === "ADMIN" && user.approvalStatus === "VALIDATED");
    return (
        <div className="w-full h-full p-4">
            <Card className="w-full max-h-[calc(100vh-4rem)] h-full overflow-scroll">
                <AdminTable admins={admins} />
            </Card>
        </div>
    );
}

export default Page;
