import { $fetch } from "@/app/actions/fetch";
import { getToken } from "@/app/getToken";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";
import { DisplayProfessions } from "./components/display-professions";

async function Page() {
    const { data } = await $fetch("/professions", {
        auth: await getToken(),
    });

    const professions: {
        id: number;
        name: string;
    }[] = data?.data;

    return (
        <Tabs defaultValue="Tous" className="p-4 h-full">
            <TabsList className="grid  grid-cols-2 bg-muted w-[400px]">
                <TabsTrigger value="Tous">Tous</TabsTrigger>
                <TabsTrigger value="Demandes">Professions</TabsTrigger>
            </TabsList>
            <TabsContent value="Tous" className="h-full ">
                <Card className="h-[calc(100vh-9rem)]"></Card>
            </TabsContent>
            <TabsContent value="Demandes">
                <Card className="h-[calc(100vh-9rem)] overflow-scroll">
                    <DisplayProfessions professions={professions} />
                </Card>
            </TabsContent>
        </Tabs>
    );
}

export default Page;
