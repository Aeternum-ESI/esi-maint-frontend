"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarList, DonutChart } from "./charts";

type AssetStatisticsProps = {
    stats: {
        byStatus: { status: string; count: number }[];
        byType: { type: string; count: number }[];
        byCategory: { categoryName: string; count: number }[];
        topProblems: { id: number; name: string; count: number }[];
    } | null;
};

export function AssetStatistics({ stats }: AssetStatisticsProps) {
    if (!stats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Asset Statistics</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading asset statistics...</p>
                </CardContent>
            </Card>
        );
    }

    // Format the data for the charts
    const statusData = stats.byStatus.map((item) => ({
        name: item.status,
        value: item.count,
    }));

    const typeData = stats.byType.map((item) => ({
        name: item.type,
        value: item.count,
    }));

    const categoryData = stats.byCategory
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .map((item) => ({
            name: item.categoryName,
            value: item.count,
        }));

    const problemData = stats.topProblems.map((item) => ({
        name: item.name,
        value: item.count,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Asset Statistics</CardTitle>
                <CardDescription>Overview of asset distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="status">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="status">By Status</TabsTrigger>
                        <TabsTrigger value="type">By Type</TabsTrigger>
                        <TabsTrigger value="category">By Category</TabsTrigger>
                        <TabsTrigger value="problems">Top Problems</TabsTrigger>
                    </TabsList>

                    <TabsContent value="status" className="pt-4 h-[300px]">
                        <DonutChart data={statusData} />
                    </TabsContent>

                    <TabsContent value="type" className="pt-4 h-[300px]">
                        <DonutChart data={typeData} />
                    </TabsContent>

                    <TabsContent value="category" className="pt-4 h-[300px]">
                        {categoryData.length > 0 ? (
                            <BarList data={categoryData} />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-muted-foreground">No category data available</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="problems" className="pt-4 h-[300px]">
                        {problemData.length > 0 ? (
                            <BarList data={problemData} />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-muted-foreground">No problem data available</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
