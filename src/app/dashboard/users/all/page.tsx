import { $fetch } from "@/app/actions/fetch";
import { getToken } from "@/app/getToken";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/types";
import { AllUsers, ValidateUsers } from "./components/all-users";

export async function Page() {
    const { data } = await $fetch("users", {
        auth: await getToken(),
    });

    const users: User[] = data?.data;

    return (
        <Tabs defaultValue="Tous" className="p-4 h-full">
            <TabsList className="grid  grid-cols-2 bg-muted w-[400px]">
                <TabsTrigger value="Tous">Tous</TabsTrigger>
                <TabsTrigger value="Demandes">Demandes</TabsTrigger>
            </TabsList>
            <TabsContent value="Tous" className="h-full ">
                <Card className="h-[calc(100vh-9rem)]">
                    <AllUsers users={users} />
                </Card>
            </TabsContent>
            <TabsContent value="Demandes">
                <Card className="h-[calc(100vh-9rem)] overflow-scroll">
                    <ValidateUsers users={users.filter((user) => user.approvalStatus === "PENDING")} />
                </Card>
            </TabsContent>
        </Tabs>
    );
}

export default Page;
