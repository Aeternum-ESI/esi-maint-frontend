"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonutChart } from "./charts";
import { useEffect, useState } from "react";
import { fetchRepStats } from "@/app/actions/stats.action";

type ReportStatisticsProps = {
    stats: {
        byStatus: { status: string; count: number }[];
        byPriority: { priority: string; count: number }[];
        byType: { type: string; count: number }[];
        avgResolutionTime: number;
    } | null;
};

export function ReportStatistics({ stats }: ReportStatisticsProps) {
    const [timeSeriesData, setTimeSeriesData] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // Client-side fetch for time series data
    useEffect(() => {
        async function fetchTimeSeriesData() {
            try {
                const { data } = await fetchRepStats();

                if (data) {
                    setTimeSeriesData(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch time series data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTimeSeriesData();
    }, []);

    if (!stats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Report Statistics</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading report statistics...</p>
                </CardContent>
            </Card>
        );
    }

    // Format the data for the charts
    const statusData = stats.byStatus.map((item) => ({
        name: item.status,
        value: item.count,
    }));

    const priorityData = stats.byPriority.map((item) => ({
        name: item.priority,
        value: item.count,
    }));

    const typeData = stats.byType.map((item) => ({
        name: item.type,
        value: item.count,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
                <CardDescription>
                    {stats.avgResolutionTime ? (
                        <span>
                            Average resolution time: <strong>{stats.avgResolutionTime} hours</strong>
                        </span>
                    ) : (
                        "Overview of report distribution"
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="status">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="status">By Status</TabsTrigger>
                        <TabsTrigger value="priority">By Priority</TabsTrigger>
                        <TabsTrigger value="type">By Type</TabsTrigger>
                    </TabsList>

                    <TabsContent value="status" className="pt-4 h-[300px]">
                        <DonutChart data={statusData} />
                    </TabsContent>

                    <TabsContent value="priority" className="pt-4 h-[300px]">
                        <DonutChart data={priorityData} />
                    </TabsContent>

                    <TabsContent value="type" className="pt-4 h-[300px]">
                        <DonutChart data={typeData} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
