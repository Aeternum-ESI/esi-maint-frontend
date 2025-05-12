"use client";

import { completeInterventionRequest } from "@/app/actions/interventionRequests.action";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Asset, InterventionRequestStatus, OperationType, Priority, TechnicianAssignment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle2, Clock, LayoutGrid, ListFilter, LocateFixed, MapPin, Wrench } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export const AssignedRequests = ({ assignments }: { assignments: TechnicianAssignment[] }) => {
    const [activeView, setActiveView] = useState<"card" | "table">("card");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completionDescription, setCompletionDescription] = useState("");

    const pendingAssignments = assignments.filter((assignment) => !assignment.completed);
    const completedAssignments = assignments.filter((assignment) => assignment.completed);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getPriorityVariant = (priority: Priority) => {
        switch (priority) {
            case Priority.HIGH:
                return "destructive";
            case Priority.MEDIUM:
                return "default";
            case Priority.LOW:
                return "outline";
            default:
                return "secondary";
        }
    };

    const getOperationTypeIcon = (type: OperationType) => {
        switch (type) {
            case OperationType.CORRECTIVE:
                return <Wrench className="h-4 w-4" />;
            case OperationType.PREVENTIVE:
                return <CheckCircle2 className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const renderCompletionDialog = (assignment: TechnicianAssignment) => {
        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!completionDescription || completionDescription.trim() === "") {
                toast.error("Please provide completion details");
                return;
            }

            setIsSubmitting(true);

            try {
                await completeInterventionRequest(
                    assignment.interventionRequest!.id,
                    completionDescription
                );

                toast.success("Assignment marked as complete", {
                    style: { background: "#10b981", color: "white" }
                });
                setCompletionDescription("");

                const dialogCloseButton = document.querySelector("[data-dialog-close]");
                if (dialogCloseButton instanceof HTMLElement) {
                    dialogCloseButton.click();
                }

                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } catch (error) {
                toast.error("Failed to complete assignment", {
                    style: { background: "#ef4444", color: "white" }
                });
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <Dialog onOpenChange={() => setCompletionDescription("")}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 shadow-sm"
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Complete
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-xl font-semibold">Complete Assignment</DialogTitle>
                    <div className="space-y-4 mt-2">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
                            <p className="text-amber-800 text-sm">
                                Please provide details about how this assignment was completed. This will be recorded in the system logs.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Textarea
                                placeholder="Describe what was done, materials used, or any issues encountered..."
                                value={completionDescription}
                                onChange={(e) => setCompletionDescription(e.target.value)}
                                className="w-full h-32 p-3 border rounded-md resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                            <div className="flex items-center w-full justify-end gap-3">
                                <DialogClose asChild data-dialog-close>
                                    <Button type="button" variant="outline" className="border-gray-300">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className={cn(
                                        "bg-emerald-500 hover:bg-emerald-600 text-white transition-colors",
                                        isSubmitting && "opacity-80 cursor-not-allowed"
                                    )}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Complete Assignment"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    My Assignments
                </h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 mr-2">View:</span>
                    <div className="flex border rounded-md overflow-hidden bg-white shadow-sm">
                        <Button
                            variant={activeView === "card" ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                                "rounded-none h-9",
                                activeView === "card" ? "bg-primary text-primary-foreground" : "text-gray-600"
                            )}
                            onClick={() => setActiveView("card")}
                        >
                            <LayoutGrid className="h-4 w-4 mr-1" /> Cards
                        </Button>
                        <Separator orientation="vertical" className="h-9" />
                        <Button
                            variant={activeView === "table" ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                                "rounded-none h-9",
                                activeView === "table" ? "bg-primary text-primary-foreground" : "text-gray-600"
                            )}
                            onClick={() => setActiveView("table")}
                        >
                            <ListFilter className="h-4 w-4 mr-1" /> Table
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-8">
                <section>
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                        <div className="bg-amber-100 p-1.5 rounded-full">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Pending ({pendingAssignments.length})
                        </h2>
                    </div>

                    {pendingAssignments.length === 0 ? (
                        <Card className="bg-gray-50 border-dashed">
                            <CardContent className="py-8 text-center text-gray-500 flex flex-col items-center">
                                <CheckCircle2 className="h-12 w-12 text-gray-300 mb-3" />
                                <p>All caught up! No pending assignments.</p>
                            </CardContent>
                        </Card>
                    ) : activeView === "card" ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {pendingAssignments.map((assignment) => (
                                <Card key={assignment.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                                    <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-transparent">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">
                                                {assignment.interventionRequest?.title || "Untitled Assignment"}
                                            </CardTitle>
                                            {assignment.interventionRequest?.status && (
                                                <Badge variant={
                                                    assignment.interventionRequest.status === InterventionRequestStatus.OVERDUE
                                                        ? "destructive"
                                                        : "outline"
                                                }>
                                                    {assignment.interventionRequest.status}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="flex items-center gap-1 text-gray-500">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Created: {formatDate(assignment.createdAt)}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="py-3">
                                        <div className="flex flex-col gap-3">
                                            {assignment.location && (
                                                <div>
                                                    <p className="text-sm font-medium mb-1 text-gray-700">Location:</p>
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>{assignment.location.name}</span>
                                                        {assignment.location.type && (
                                                            <Badge variant="outline" className="ml-1 text-xs">
                                                                {assignment.location.type}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {assignment.interventionRequest?.deadline && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span
                                                        className={cn(
                                                            "text-sm",
                                                            new Date(assignment.interventionRequest.deadline) < new Date()
                                                                ? "text-destructive font-medium"
                                                                : "text-gray-600"
                                                        )}
                                                    >
                                                        Due by: {formatDate(assignment.interventionRequest.deadline)}
                                                    </span>
                                                </div>
                                            )}

                                            {assignment.interventionRequest?.report && (
                                                <Accordion type="single" collapsible className="w-full">
                                                    <AccordionItem value="report-details" className="border-b-0">
                                                        <AccordionTrigger className="py-2 text-sm">
                                                            View Report Details
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="space-y-3 text-sm bg-muted/50 p-3 rounded-md">
                                                                <div className="flex justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        {assignment.interventionRequest.report.type &&
                                                                            getOperationTypeIcon(
                                                                                assignment.interventionRequest.report.type
                                                                            )}
                                                                        <span className="text-gray-700">
                                                                            {assignment.interventionRequest.report.type}{" "}
                                                                            Maintenance
                                                                        </span>
                                                                    </div>

                                                                    {assignment.interventionRequest.report.priority && (
                                                                        <Badge
                                                                            variant={getPriorityVariant(
                                                                                assignment.interventionRequest.report
                                                                                    .priority
                                                                            )}
                                                                        >
                                                                            {assignment.interventionRequest.report.priority}{" "}
                                                                            Priority
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                {assignment.interventionRequest.report.description && (
                                                                    <div>
                                                                        <p className="font-medium text-gray-700">Description:</p>
                                                                        <p className="text-muted-foreground">
                                                                            {
                                                                                assignment.interventionRequest.report
                                                                                    .description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {assignment.interventionRequest.report.asset && (
                                                                    <div>
                                                                        <p className="font-medium text-gray-700">Asset:</p>
                                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                                            <LocateFixed className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    assignment.interventionRequest.report
                                                                                        .asset.name
                                                                                }
                                                                            </span>
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="ml-1 text-xs"
                                                                            >
                                                                                {
                                                                                    assignment.interventionRequest.report
                                                                                        .asset.type
                                                                                }
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {assignment.interventionRequest.report.imageUrl && (
                                                                    <div className="w-full">
                                                                        <p className="font-medium text-gray-700">Image:</p>
                                                                        <div className="mt-1 w-full">
                                                                            <Image
                                                                                width={200}
                                                                                height={200}
                                                                                src={
                                                                                    assignment.interventionRequest.report
                                                                                        .imageUrl
                                                                                }
                                                                                alt="Report image"
                                                                                className="h-40 w-auto object-cover rounded-md"
                                                                                onError={(e) => {
                                                                                    (e.target as HTMLImageElement).src = "/static/placeholder-image.png";
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {assignment.interventionRequest.report.reporter && (
                                                                    <div>
                                                                        <p className="font-medium text-gray-700">Reported By:</p>
                                                                        <p className="text-muted-foreground">
                                                                            {
                                                                                assignment.interventionRequest.report
                                                                                    .reporter.name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-end gap-2 pt-0 pb-3">
                                        {renderCompletionDialog(assignment)}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingAssignments.map((assignment) => (
                                            <TableRow
                                                key={assignment.id}
                                                className="group hover:bg-amber-50 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    {assignment.interventionRequest?.title || "Untitled Assignment"}
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.interventionRequest?.status && (
                                                        <Badge variant={
                                                            assignment.interventionRequest.status === InterventionRequestStatus.OVERDUE
                                                                ? "destructive"
                                                                : "outline"
                                                        }>
                                                            {assignment.interventionRequest.status}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.location ? (
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span>{assignment.location.name}</span>
                                                        </div>
                                                    ) : (
                                                        "No location"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.interventionRequest?.deadline ? (
                                                        <span className={cn(
                                                            "flex items-center",
                                                            new Date(assignment.interventionRequest.deadline) < new Date()
                                                                ? "text-red-600 font-medium"
                                                                : "text-gray-600"
                                                        )}>
                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                            {formatDate(assignment.interventionRequest.deadline)}
                                                        </span>
                                                    ) : (
                                                        "No deadline"
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {renderCompletionDialog(assignment)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                        <div className="bg-emerald-100 p-1.5 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Completed ({completedAssignments.length})
                        </h2>
                    </div>

                    {completedAssignments.length === 0 ? (
                        <Card className="bg-gray-50 border-dashed">
                            <CardContent className="py-8 text-center text-gray-500 flex flex-col items-center">
                                <Wrench className="h-12 w-12 text-gray-300 mb-3" />
                                <p>No completed assignments yet.</p>
                            </CardContent>
                        </Card>
                    ) : activeView === "card" ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {completedAssignments.map((assignment) => (
                                <Card
                                    key={assignment.id}
                                    className="overflow-hidden border-l-4 border-l-emerald-500 bg-white"
                                >
                                    <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">
                                                {assignment.interventionRequest?.title || "Untitled Assignment"}
                                            </CardTitle>
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                                Completed
                                            </Badge>
                                        </div>
                                        <CardDescription className="flex items-center gap-1 text-gray-500">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Completed on: {formatDate(assignment.updatedAt || assignment.createdAt)}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="py-3">
                                        <div className="flex flex-col gap-3">
                                            {assignment.location && (
                                                <div>
                                                    <p className="text-sm font-medium mb-1 text-gray-700">Location:</p>
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>{assignment.location.name}</span>
                                                        {assignment.location.type && (
                                                            <Badge variant="outline" className="ml-1 text-xs">
                                                                {assignment.location.type}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {assignment.interventionRequest?.report && (
                                                <Accordion type="single" collapsible className="w-full">
                                                    <AccordionItem value="report-details" className="border-b-0">
                                                        <AccordionTrigger className="py-2 text-sm">
                                                            View Report Details
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="space-y-3 text-sm bg-muted/50 p-3 rounded-md">
                                                                <div className="flex justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        {assignment.interventionRequest.report.type &&
                                                                            getOperationTypeIcon(
                                                                                assignment.interventionRequest.report.type
                                                                            )}
                                                                        <span className="text-gray-700">
                                                                            {assignment.interventionRequest.report.type}{" "}
                                                                            Maintenance
                                                                        </span>
                                                                    </div>

                                                                    {assignment.interventionRequest.report.priority && (
                                                                        <Badge
                                                                            variant={getPriorityVariant(
                                                                                assignment.interventionRequest.report
                                                                                    .priority
                                                                            )}
                                                                        >
                                                                            {assignment.interventionRequest.report.priority}{" "}
                                                                            Priority
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                {assignment.interventionRequest.report.description && (
                                                                    <div>
                                                                        <p className="font-medium text-gray-700">Description:</p>
                                                                        <p className="text-muted-foreground">
                                                                            {
                                                                                assignment.interventionRequest.report
                                                                                    .description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {assignment.interventionRequest.report.asset && (
                                                                    <div>
                                                                        <p className="font-medium text-gray-700">Asset:</p>
                                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                                            <LocateFixed className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    assignment.interventionRequest.report
                                                                                        .asset.name
                                                                                }
                                                                            </span>
                                                                            {assignment.interventionRequest.report.asset.type && (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="ml-1 text-xs"
                                                                                >
                                                                                    {
                                                                                        assignment.interventionRequest.report
                                                                                            .asset.type
                                                                                    }
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {assignment.interventionRequest.report.imageUrl && (
                                                                    <div className="w-full">
                                                                        <p className="font-medium text-gray-700">Image:</p>
                                                                        <div className="mt-1 w-1/2 m-auto">
                                                                            <Image
                                                                                width={200}
                                                                                height={200}
                                                                                src={
                                                                                    assignment.interventionRequest.report
                                                                                        .imageUrl
                                                                                }
                                                                                alt="Report image"
                                                                                className="w-full object-cover rounded-md"
                                                                                onError={(e) => {
                                                                                    (e.target as HTMLImageElement).src = "/static/placeholder-image.png";
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            )}

                                            {assignment.details && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="font-medium text-sm text-gray-700">Completion Notes:</p>
                                                    <p className="text-sm text-gray-600 mt-1 italic">"{assignment.details}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Title</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Completed On</TableHead>
                                            <TableHead>Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {completedAssignments.map((assignment) => (
                                            <TableRow
                                                key={assignment.id}
                                                className="hover:bg-emerald-50 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    {assignment.interventionRequest?.title || "Untitled Assignment"}
                                                </TableCell>
                                                <TableCell>
                                                    {assignment.location ? (
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span>{assignment.location.name}</span>
                                                        </div>
                                                    ) : (
                                                        "No location"
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {formatDate(assignment.updatedAt || assignment.createdAt)}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    <p className="text-gray-600 truncate">
                                                        {assignment.details || "No details provided"}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
};
