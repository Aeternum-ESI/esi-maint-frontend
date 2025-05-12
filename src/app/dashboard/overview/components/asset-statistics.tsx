"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarList, DonutChart } from "./charts";
import { Badge } from "@/components/ui/badge";

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
                <CardDescription className="flex justify-between">
                    <span>Overview of asset distribution</span>
                    <div className="flex gap-2 text-xs">
                        {stats.byStatus.map((item, idx) => (
                            <Badge key={idx} variant="outline" className={
                                item.status === "OPERATIONAL" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                    item.status === "MAINTENANCE" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                        "bg-red-50 text-red-700 border-red-200"
                            }>
                                {item.status}: <span className="font-bold ml-1">{item.count}</span>
                            </Badge>
                        ))}
                    </div>
                </CardDescription>
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
                            <>
                                <BarList data={problemData} />
                                <div className="mt-2">
                                    {problemData.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center px-3 py-1.5 mb-1 rounded bg-muted/40">
                                            <span className="font-medium text-sm">{item.name}</span>
                                            <span className={`text-sm font-bold ${idx === 0 ? 'text-red-500' :
                                                    idx === 1 ? 'text-orange-500' :
                                                        'text-amber-500'
                                                }`}>{item.value} issues</span>
                                        </div>
                                    ))}
                                </div>
                            </>
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
