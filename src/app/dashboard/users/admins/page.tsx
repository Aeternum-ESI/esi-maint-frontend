import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";

import { Card } from "@/components/ui/card";
import { User } from "@/lib/types";
import { AdminTable } from "./componets/admin-table";

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
