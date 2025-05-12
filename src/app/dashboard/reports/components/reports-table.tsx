"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Priority, Report, ReportStatus, OperationType } from "@/lib/types";
import { formatDate, getPriorityBadgeClass, getPriorityRowClass, getStatusBadge } from "@/utils/report-ui.utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Operation type labels for formatting code
const operationTypeLabels: Record<OperationType, string> = {
    CORRECTIVE: "Corrective",
    PREVENTIVE: "Preventive"
};

interface ReportsTableProps {
    reports: Report[];
    error?: string | null;
}

export default function ReportsTable({ reports, error }: ReportsTableProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState<ReportStatus | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
    const [typeFilter, setTypeFilter] = useState<OperationType | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    // Apply filters and sorting to reports
    const filteredReports = reports
        .filter(
            (report) =>
                (!statusFilter || report.status === statusFilter) &&
                (!priorityFilter || report.priority === priorityFilter) &&
                (!typeFilter || report.type === typeFilter) &&
                (!searchQuery ||
                    report.asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    report.interventionRequests?.some((ir) =>
                        ir.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ))
        )
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-2">Loading reports...</span>
            </div>
        );
    }

    return (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-xl">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <Label htmlFor="search" className="mb-1 block">
                                Search
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    id="search"
                                    placeholder="Search by asset, description, or intervention request"
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="status" className="mb-1 block">
                                Status
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setStatusFilter(value === "all" ? null : (value as ReportStatus))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                                    <SelectItem value="CANCELED">Canceled</SelectItem>
                                    <SelectItem value="TREATED">Treated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="priority" className="mb-1 block">
                                Priority
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setPriorityFilter(value === "all" ? null : (value as Priority))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="type" className="mb-1 block">
                                Type
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setTypeFilter(value === "all" ? null : (value as OperationType))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                                    <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="sort" className="mb-1 block">
                                Sort By
                            </Label>
                            <Select
                                value={sortOrder}
                                onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort Order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error ? (
                <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">{error}</div>
            ) : (
                <>
                    <div className="bg-white rounded-md shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Asset</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Reported By</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReports.length > 0 ? (
                                        filteredReports.map((report) => (
                                            <TableRow
                                                key={report.id}
                                                className={getPriorityRowClass(report.priority)}
                                                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {`${new Date(report.createdAt)
                                                        .getFullYear()
                                                        .toString()
                                                        .slice(2, 4)}-${operationTypeLabels[report.type].toUpperCase().slice(0, 3)}-${
                                                        report.id
                                                    }`}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {report.asset?.name || "No Asset"}
                                                    {report.category && (
                                                        <span className="text-sm text-gray-500 ml-1">
                                                            ({report.category.name})
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{report.type}</Badge>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(report.status)}</TableCell>
                                                <TableCell>
                                                    <Badge className={getPriorityBadgeClass(report.priority)}>
                                                        {report.priority}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{report.reporter?.name ?? "Unknown"}</TableCell>
                                                <TableCell>{formatDate(report.createdAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/dashboard/reports/${report.id}`);
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                                                No reports found matching the current filters
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                        {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} found
                    </div>
                </>
            )}
        </>
    );
}
