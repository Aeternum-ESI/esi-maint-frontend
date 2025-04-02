import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Category, Asset } from "@/lib/types";
import { DisplayCategories } from "./components/display-categories";
import { DisplayAssets } from "./components/display-assets";

async function Page() {
    const { data: categoriesData, error: categoriesError } = await $fetch("/categories", {
        auth: await getToken(),
    });

    const { data: assetsData, error: assetsError } = await $fetch("/assets", {
        auth: await getToken(),
    });

    const { data: locationsData, error: locationsError } = await $fetch("/assets/locations", {
        auth: await getToken(),
    });

    // Handle any errors (you could also throw an error here to trigger error boundary)
    if (categoriesError || assetsError || locationsError) {
        console.error("API Errors:", { categoriesError, assetsError, locationsError });
        // You could return an error component here or throw an error
    }

    const categories: Category[] = categoriesData?.data || [];
    const assets: Asset[] = assetsData?.data || [];
    const locations: Asset[] = locationsData?.data || [];

    return (
        <Tabs defaultValue="Tous" className="p-4 h-full">
            <TabsList className="grid  grid-cols-2 bg-muted w-[400px]">
                <TabsTrigger value="Tous">Assets</TabsTrigger>
                <TabsTrigger value="Demandes">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="Tous" className="h-full">
                <Card className="h-[calc(100vh-9rem)] p-4 overflow-auto">
                    <DisplayAssets assets={assets} locations={locations} categories={categories} />
                </Card>
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
