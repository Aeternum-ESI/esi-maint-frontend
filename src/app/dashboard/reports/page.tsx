import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";

import ReportsTable from "./components/reports-table";
import ExportButtons from "./components/export-buttons";
import { Report } from "@/lib/types";

async function ReportsPage() {
    // Server-side data fetching
    const { data, error } = await $fetch("/reports", {
        auth: await getToken(),
    });

    const reports: Report[] = data?.data || [];

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <p className="text-gray-600">View and manage all reports</p>
                </div>
                <ExportButtons reports={reports} />
            </div>

            <ReportsTable reports={reports} />
        </div>
    );
}

export default ReportsPage;
