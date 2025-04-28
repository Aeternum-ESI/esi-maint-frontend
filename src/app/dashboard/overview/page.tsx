import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Metadata } from "next";
import { OverviewStats } from "./components/overview-stats";
import { AssetStatistics } from "./components/asset-statistics";
import { ReportStatistics } from "./components/report-statistics";
import { TechnicianStatistics } from "./components/technician-statistics";
import { CategoryStatistics } from "./components/category-statistics";

export const metadata: Metadata = {
    title: "Overview | ESIMaint",
    description: "Dashboard overview and statistics for the ESI maintenance system",
};

// Type for the overview statistics response
type OverviewStatsResponse = {
    totalAssets: number;
    totalReports: number;
    totalInterventions: number;
    pendingReports: number;
    resolvedReports: number;
    resolutionRate: number;
};

// Type for asset statistics
type AssetByStatus = { status: string; count: number }[];
type AssetByType = { type: string; count: number }[];
type AssetByCategory = { categoryName: string; count: number }[];
type TopProblemAsset = { id: number; name: string; count: number }[];

// Type for report statistics
type ReportByStatus = { status: string; count: number }[];
type ReportByPriority = { priority: string; count: number }[];
type ReportByType = { type: string; count: number }[];
type AverageResolutionTime = number;

// Function to fetch data server-side
async function getOverviewStats() {
    try {
        const { data, error } = await $fetch("/stats/overview", {
            auth: await getToken(),
        });

        if (error) {
            console.error("Error fetching overview stats:", error);
            return null;
        }

        return data?.data as OverviewStatsResponse;
    } catch (error) {
        console.error("Failed to fetch overview stats:", error);
        return null;
    }
}

async function getAssetStats() {
    try {
        const [byStatus, byType, byCategory, topProblems] = await Promise.all([
            $fetch("/stats/assets/by-status", { auth: await getToken() }),
            $fetch("/stats/assets/by-type", { auth: await getToken() }),
            $fetch("/stats/assets/by-category", { auth: await getToken() }),
            $fetch("/stats/assets/top-problem-assets", { auth: await getToken() }),
        ]);

        return {
            byStatus: byStatus.data?.data as AssetByStatus,
            byType: byType.data?.data as AssetByType,
            byCategory: byCategory.data?.data as AssetByCategory,
            topProblems: topProblems.data?.data as TopProblemAsset,
        };
    } catch (error) {
        console.error("Failed to fetch asset stats:", error);
        return null;
    }
}

async function getReportStats() {
    try {
        const [byStatus, byPriority, byType, avgResolutionTime] = await Promise.all([
            $fetch("/stats/reports/by-status", { auth: await getToken() }),
            $fetch("/stats/reports/by-priority", { auth: await getToken() }),
            $fetch("/stats/reports/by-type", { auth: await getToken() }),
            $fetch("/stats/reports/avg-resolution-time", { auth: await getToken() }),
        ]);

        return {
            byStatus: byStatus.data?.data as ReportByStatus,
            byPriority: byPriority.data?.data as ReportByPriority,
            byType: byType.data?.data as ReportByType,
            avgResolutionTime: avgResolutionTime.data?.data as AverageResolutionTime,
        };
    } catch (error) {
        console.error("Failed to fetch report stats:", error);
        return null;
    }
}

async function getTopData() {
    try {
        const [topTechnicians, topCategories] = await Promise.all([
            $fetch("/stats/technicians/top", { auth: await getToken() }),
            $fetch("/stats/categories/top", { auth: await getToken() }),
        ]);

        return {
            topTechnicians: topTechnicians.data?.data,
            topCategories: topCategories.data?.data,
        };
    } catch (error) {
        console.error("Failed to fetch top data:", error);
        return null;
    }
}

export default async function OverviewPage() {
    // Fetch data in parallel
    const [overviewStats, assetStats, reportStats, topData] = await Promise.all([
        getOverviewStats(),
        getAssetStats(),
        getReportStats(),
        getTopData(),
    ]);

    return (
        <div className="container mx-auto py-6 space-y-8 p-4">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-6">
                {/* Overview Stats Cards */}
                <OverviewStats stats={overviewStats} />

                {/* Asset Statistics */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <AssetStatistics stats={assetStats} />
                    <ReportStatistics stats={reportStats} />
                </div>

                {/* Technician and Category Statistics */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <TechnicianStatistics topTechnicians={topData?.topTechnicians} />
                    <CategoryStatistics topCategories={topData?.topCategories} />
                </div>
            </div>
        </div>
    );
}
