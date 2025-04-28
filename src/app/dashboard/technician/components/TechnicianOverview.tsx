import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, Clock, AlertTriangle, Wrench } from "lucide-react";
import { TechnicianApiType } from "../page";

export function TechnicianOverview({ technicianData }: { technicianData: TechnicianApiType }) {
    const getOverdueCount = () =>
        technicianData?.TechnicianAssignements.filter(
            (assignment) =>
                !assignment.completed &&
                assignment.interventionRequest?.deadline &&
                new Date(assignment.interventionRequest.deadline) < new Date()
        ).length || 0;

    const stats = [
        {
            title: "Assigned Requests",
            value: technicianData?.TechnicianAssignements.filter((e) => !e.completed).length || 0,
            description: "Current pending tasks",
            icon: <Clock className="h-5 w-5 text-yellow-500" />,
            color: "bg-yellow-50 border-yellow-200",
        },
        {
            title: "Completed Interventions",
            value: technicianData?.TechnicianAssignements.filter((e) => e.completed).length || 0,
            description: "Successfully resolved",
            icon: <CircleCheck className="h-5 w-5 text-green-500" />,
            color: "bg-green-50 border-green-200",
        },
        {
            title: "Profession",
            value: technicianData?.profession?.name || "Not specified",
            description: "Specialization area",
            icon: <Wrench className="h-5 w-5 text-blue-500" />,
            color: "bg-blue-50 border-blue-200",
        },
        {
            title: "OVERDUE",
            value: getOverdueCount(),
            description: "Overdue assignments",
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            color: "bg-red-50 border-red-200",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className={`border ${stat.color}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Technician Information</CardTitle>
                        <CardDescription>Your personal and professional details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-medium">Name</span>
                            <span>{technicianData?.user?.name || "Not available"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-medium">Email</span>
                            <span>{technicianData?.user?.email || "Not available"}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-medium">Profession</span>
                            <span>{technicianData?.profession?.name || "Not assigned"}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-medium">Member Since</span>
                            <span>
                                {technicianData?.createdAt
                                    ? new Date(technicianData.createdAt).toLocaleDateString()
                                    : "Not available"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest interventions and activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {technicianData?.Interventions?.length > 0 ? (
                            <div className="space-y-4">
                                {technicianData.Interventions.slice(0, 5).map((intervention, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <Wrench className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{intervention.description.slice(0, 40)}...</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(intervention.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">No recent activities found</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
