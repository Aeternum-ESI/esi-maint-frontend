import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Category } from "@/lib/types";
import { DisplayCategories } from "./components/display-categories";

async function Page() {
    const { data } = await $fetch("/categories", {
        auth: await getToken(),
    });

    const categories: Category[] = data?.data || [];

    return (
        <Tabs defaultValue="Tous" className="p-4 h-full">
            <TabsList className="grid  grid-cols-2 bg-muted w-[400px]">
                <TabsTrigger value="Tous">Assets</TabsTrigger>
                <TabsTrigger value="Demandes">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="Tous" className="h-full ">
                <Card className="h-[calc(100vh-9rem)] p-4 "></Card>
            </TabsContent>
            <TabsContent value="Demandes">
                <Card className="h-[calc(100vh-9rem)] overflow-scroll p-4">
                    <DisplayCategories categories={categories} />
                </Card>
            </TabsContent>
        </Tabs>
    );
}

export default Page;
