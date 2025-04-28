"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, CheckCircle, Clock, FileText, Package } from "lucide-react";

type OverviewStatsProps = {
    stats: {
        totalAssets: number;
        totalReports: number;
        totalInterventions: number;
        pendingReports: number;
        resolvedReports: number;
        resolutionRate: number;
    } | null;
};

export function OverviewStats({ stats }: OverviewStatsProps) {
    if (!stats) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-5 w-1/3 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-1/4 bg-muted rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Assets",
            value: stats.totalAssets,
            description: "Total number of assets in the system",
            icon: <Package className="h-5 w-5 text-persian-green" />,
        },
        {
            title: "Total Reports",
            value: stats.totalReports,
            description: "Total number of reports filed",
            icon: <FileText className="h-5 w-5 text-persian-green" />,
        },
        {
            title: "Total Interventions",
            value: stats.totalInterventions,
            description: "Interventions performed",
            icon: <Activity className="h-5 w-5 text-persian-green" />,
        },
        {
            title: "Pending Reports",
            value: stats.pendingReports,
            description: "Reports awaiting action",
            icon: <Clock className="h-5 w-5 text-amber-500" />,
        },
        {
            title: "Resolved Reports",
            value: stats.resolvedReports,
            description: "Successfully handled reports",
            icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        },
        {
            title: "Resolution Rate",
            value: `${stats.resolutionRate}%`,
            description: "Percentage of resolved reports",
            icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-md font-medium">{card.title}</CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{card.value}</p>
                        <CardDescription>{card.description}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
