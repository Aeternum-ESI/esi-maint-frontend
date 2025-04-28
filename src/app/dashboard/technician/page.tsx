import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignedRequests } from "./components/AssignedRequests";

import { TechnicianOverview } from "./components/TechnicianOverview";
import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Asset, Availability, Intervention, Profession, TechnicianAssignment } from "@/lib/types";
import { AssetsExplorer } from "./components/AssetsExplorer";

export default async function TechnicianDashboard() {
    const response = await $fetch("/technicians/me", {
        auth: await getToken(),
    });

    const technicianData = response.data?.data as TechnicianApiType;
    const response2 = await $fetch("/assets", {
        auth: await getToken(),
    });

    const assets: Asset[] = response2.data?.data;

    // Fetch hierarchy of categories
    const response3 = await $fetch("/categories", {
        auth: await getToken(),
    });
    const categories = response3.data?.data;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6 max-lg:grid-cols-2 w-full [&>*]:m-2 h-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="requests">Assigned Requests</TabsTrigger>
                    <TabsTrigger value="assets">Assets</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">{<TechnicianOverview technicianData={technicianData} />}</TabsContent>

                <TabsContent value="requests">
                    {<AssignedRequests assignments={technicianData.TechnicianAssignements} />}
                </TabsContent>

                <TabsContent value="assets">
                    <AssetsExplorer assets={assets} categories={categories} />{" "}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// API-specific type for /technicians/me endpoint
export type TechnicianApiType = {
    userId: number;
    professionId: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatarUrl: string;
        role: "TECHNICIAN";
        approvalStatus: "VALIDATED" | "PENDING" | "REJECTED";
        createdAt: string;
        updatedAt: string;
    };
    TechnicianAssignements: TechnicianAssignment[];
    availabilities: Availability[];
    profession: Profession;
    Interventions: Intervention[];
};
