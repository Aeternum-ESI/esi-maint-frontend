"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BarList } from "./charts";
import { fetchTechStats } from "@/app/actions/stats.action";

type TechnicianStatsData = {
    id: number;
    name: string;
    completedInterventions: number;
    pendingInterventions: number;
    averageCompletionTimeHours: number;
}[];

type TopTechnicianData = {
    id: number;
    name: string;
    count: number;
}[];

type TechnicianStatisticsProps = {
    topTechnicians?: TopTechnicianData;
};

export function TechnicianStatistics({ topTechnicians }: TechnicianStatisticsProps) {
    const [technicianStats, setTechnicianStats] = useState<TechnicianStatsData | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch technician statistics
    useEffect(() => {
        async function fetchTechnicianStats() {
            try {
                const { data } = await fetchTechStats();

                if (data) {
                    setTechnicianStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch technician stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTechnicianStats();
    }, []);

    // Format top technicians data for the chart
    const topTechData =
        topTechnicians?.map((tech) => ({
            name: tech.name,
            value: tech.count,
        })) || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Technician Performance</CardTitle>
                    <CardDescription>Top performing technicians</CardDescription>
                </div>
                <UserCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Loading technician statistics...</p>
                    </div>
                ) : topTechData.length > 0 ? (
                    <div className="h-[300px]">
                        <BarList data={topTechData} />
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No technician data available</p>
                    </div>
                )}

                {technicianStats && technicianStats.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Technician Details</h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {technicianStats.map((tech) => (
                                <div key={tech.id} className="p-2 bg-muted/40 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{tech.name}</span>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            <span className="font-bold text-emerald-600">{tech.completedInterventions}</span> completed
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        <span>Pending: <span className={`font-medium ${tech.pendingInterventions > 3 ? 'text-amber-600' : 'text-blue-600'}`}>{tech.pendingInterventions}</span></span>
                                        <span className="mx-2">|</span>
                                        <span>Avg time: <span className={`font-medium ${tech.averageCompletionTimeHours > 24 ? 'text-red-600' : tech.averageCompletionTimeHours > 12 ? 'text-amber-600' : 'text-emerald-600'}`}>{tech.averageCompletionTimeHours}h</span></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
