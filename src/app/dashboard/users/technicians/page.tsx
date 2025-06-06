import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profession, Technician } from "@/lib/types";
import { DisplayProfessions } from "./components/display-professions";
import { DisplayTechnicians } from "./components/display-technicians";

async function Page() {
    const { data } = await $fetch("/professions", {
        auth: await getToken(),
    });

    const professions: Profession[] = data?.data ?? [];

    const response = await $fetch("/technicians", {
        auth: await getToken(),
    });

    const technicians: Technician[] = response.data?.data ?? [];

    return (
        <Tabs defaultValue="All" className="p-4 h-full">
            <TabsList className="grid  grid-cols-2 bg-muted w-[400px]">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Professions">Professions</TabsTrigger>
            </TabsList>
            <TabsContent value="All" className="h-full ">
                <Card className="h-[calc(100vh-9rem)] overflow-scroll gap-4 p-4">
                    <DisplayTechnicians technicians={technicians} professions={professions} />
                </Card>
            </TabsContent>
            <TabsContent value="Professions">
                <Card className="h-[calc(100vh-9rem)] overflow-scroll">
                    <DisplayProfessions professions={professions} />
                </Card>
            </TabsContent>
        </Tabs>
    );
}

export default Page;
