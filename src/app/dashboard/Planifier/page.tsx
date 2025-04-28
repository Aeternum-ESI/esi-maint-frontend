import { getScheduledTasks } from "@/app/actions/tasks.action";
import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Asset, Category } from "@/lib/types";
import { CalendarWrapper } from "./components/CalendarWrapper";
import { PlannedTasksList } from "./components/PlannedTasksList";

async function PlanifierPage() {
    // Fetch data in parallel
    const [assetsResponse, categoriesResponse, scheduledTasks] = await Promise.all([
        $fetch("/assets", { auth: await getToken() }),
        $fetch("/categories", { auth: await getToken() }),
        getScheduledTasks(),
    ]);

    const assets: Asset[] = assetsResponse.data?.data || [];
    const categories: Category[] = categoriesResponse.data?.data || [];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Planification de Maintenance Préventive</h1>

            <Tabs defaultValue="planifier" className="w-full">
                <TabsList className="grid grid-cols-2 w-[400px]">
                    <TabsTrigger value="planifier">Planifier</TabsTrigger>
                    <TabsTrigger value="taches">Tâches planifiées</TabsTrigger>
                </TabsList>

                <TabsContent value="planifier">
                    <CalendarWrapper assets={assets} categories={categories} />
                </TabsContent>

                <TabsContent value="taches" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <PlannedTasksList scheduledTasks={scheduledTasks} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default PlanifierPage;
