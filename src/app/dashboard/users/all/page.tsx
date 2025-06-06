import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/types";
import { AllUsers, ValidateUsers } from "./components/all-users";

async function Page() {
    const { data } = await $fetch("users", {
        auth: await getToken(),
    });

    const users: User[] = data?.data;

    return (
        <Tabs defaultValue="All" className="p-4 h-full">
            <TabsList className="grid  grid-cols-2 bg-muted w-[400px]">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Requests">Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="All" className="h-full ">
                <Card className="h-[calc(100vh-9rem)]">
                    <AllUsers users={users} />
                </Card>
            </TabsContent>
            <TabsContent value="Requests">
                <Card className="h-[calc(100vh-9rem)] overflow-scroll">
                    <ValidateUsers users={users.filter((user) => user.approvalStatus === "PENDING")} />
                </Card>
            </TabsContent>
        </Tabs>
    );
}

export default Page;
