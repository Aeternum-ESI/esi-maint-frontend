import { $fetch } from "../fetch";
import { getToken } from "../getToken";
import { Card } from "@/components/ui/card";
import ReportProblemForm from "./components/report-problem-form";

async function Page() {
    const reponse = await $fetch("/categories", {
        method: "GET",
        auth: await getToken(),
    });
    
    const categories = reponse.data?.data || [];

    const response2 = await $fetch("/assets", {
        method: "GET",
        auth: await getToken(),
    });
    console.log(response2);

    const assets = response2.data?.data || [];

    return (
        <div className="flex items-center justify-center p-6">
            <Card className="w-full max-w-4xl p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center">Report a Problem</h1>
                <ReportProblemForm initialAssets={assets} categories={categories} />
            </Card>
        </div>
    );
}

export default Page;
