import { completeInterventionRequest } from "@/app/actions/interventionRequests.action";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Asset, InterventionRequestStatus, OperationType, Priority, TechnicianAssignment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle2, Clock, LocateFixed, MapPin, TriangleAlert, Wrench } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export const AssignedRequests = ({ assignments }: { assignments: TechnicianAssignment[] }) => {
    // Group assignments by completion status
    const pendingAssignments = assignments.filter((assignment) => !assignment.completed);
    const completedAssignments = assignments.filter((assignment) => assignment.completed);

    // Format date to readable string
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get priority badge variant
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

    // Get operation type icon
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

    // Get status badge
    const getStatusBadge = (status: InterventionRequestStatus) => {
        switch (status) {
            case InterventionRequestStatus.IN_PROGRESS:
                return <Badge variant="outline">In Progress</Badge>;
            case InterventionRequestStatus.COMPLETED:
                return <Badge variant="secondary">Completed</Badge>;
            case InterventionRequestStatus.OVERDUE:
                return <Badge variant="destructive">Overdue</Badge>;
            default:
                return null;
        }
    };

    // Render location if available
    const renderLocation = (location: Asset | null | undefined) => {
        if (!location) return "No location specified";
        return (
            <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{location.name}</span>
                {location.type && (
                    <Badge variant="outline" className="ml-1 text-xs">
                        {location.type}
                    </Badge>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Pending Assignments Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <h2 className="text-xl font-semibold">Pending Assignments ({pendingAssignments.length})</h2>
                </div>

                {pendingAssignments.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No pending assignments
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {pendingAssignments.map((assignment) => (
                            <Card key={assignment.id} className="overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">
                                            {assignment.interventionRequest?.title || "Untitled Assignment"}
                                        </CardTitle>
                                        {assignment.interventionRequest?.status &&
                                            getStatusBadge(assignment.interventionRequest.status)}
                                    </div>
                                    <CardDescription className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Created: {formatDate(assignment.createdAt)}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-2">
                                    <div className="flex flex-col gap-3">
                                        {assignment.location && (
                                            <div>
                                                <p className="text-sm font-medium mb-1">Location:</p>
                                                {renderLocation(assignment.location)}
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
                                                            : ""
                                                    )}
                                                >
                                                    Due by: {formatDate(assignment.interventionRequest.deadline)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Report Details in Accordion */}
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
                                                                    <span>
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
                                                                    <p className="font-medium">Description:</p>
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
                                                                    <p className="font-medium">Asset:</p>
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
                                                                <div className="w-full ">
                                                                    <p className="font-medium">Image:</p>
                                                                    <div className="mt-1 w-full ">
                                                                        <Image
                                                                            width={200}
                                                                            height={200}
                                                                            objectFit="cover"
                                                                            src={
                                                                                assignment.interventionRequest.report
                                                                                    .imageUrl
                                                                            }
                                                                            alt="Report image"
                                                                            className="h-40 w-auto object-cover rounded-md"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {assignment.interventionRequest.report.reporter && (
                                                                <div>
                                                                    <p className="font-medium">Reported By:</p>
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

                                <CardFooter className="pt-2 flex justify-end gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                                Mark as Completed
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Complete Assignment</DialogTitle>
                                            <div className="space-y-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Are you sure you want to mark this assignment as completed?
                                                </p>

                                                <form
                                                    action={async (formData) => {
                                                        "use server";
                                                        const description = formData.get("description") as string;

                                                        // Server-side validation to ensure description is provided
                                                        if (!description || description.trim() === "") {
                                                            return;
                                                        }

                                                        await completeInterventionRequest(
                                                            assignment.interventionRequest!.id,
                                                            description
                                                        );
                                                    }}
                                                >
                                                    <Textarea
                                                        placeholder="Add completion details (required)..."
                                                        name="description"
                                                        className="w-full h-24 p-2 border rounded-md"
                                                        required
                                                    />
                                                    <div className="flex items-center w-full justify-end gap-2 mt-4">
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button
                                                            type="submit"
                                                            className="bg-primary hover:bg-primary/90"
                                                        >
                                                            Complete
                                                        </Button>
                                                    </div>
                                                </form>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Assignments Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h2 className="text-xl font-semibold">Completed Assignments ({completedAssignments.length})</h2>
                </div>

                {completedAssignments.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No completed assignments
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {completedAssignments.map((assignment) => (
                            <Card key={assignment.id} className="overflow-hidden bg-muted/20">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">
                                            {assignment.interventionRequest?.title || "Untitled Assignment"}
                                        </CardTitle>
                                        <Badge className="bg-emerald-400">Completed</Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Completed on: {formatDate(assignment.createdAt)}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-2">
                                    <div className="flex flex-col gap-3">
                                        {assignment.location && (
                                            <div>
                                                <p className="text-sm font-medium mb-1">Location:</p>
                                                {renderLocation(assignment.location)}
                                            </div>
                                        )}

                                        {/* Report Details in Accordion */}
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
                                                                    <span>
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
                                                                    <p className="font-medium">Description:</p>
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
                                                                    <p className="font-medium">Asset:</p>
                                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                                        <LocateFixed className="h-4 w-4" />
                                                                        <span>
                                                                            {
                                                                                assignment.interventionRequest.report
                                                                                    .asset.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {assignment.interventionRequest.report.imageUrl && (
                                                                <div className="w-full ">
                                                                    <p className="font-medium">Image:</p>
                                                                    <div className="mt-1 w-1/2 m-auto ">
                                                                        <Image
                                                                            width={200}
                                                                            height={200}
                                                                            objectFit="cover"
                                                                            src={
                                                                                assignment.interventionRequest.report
                                                                                    .imageUrl
                                                                            }
                                                                            alt="Report image"
                                                                            className="w-full object-cover rounded-md"
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
                                            <div>
                                                <p className="font-medium text-sm">Completion Details:</p>
                                                <p className="text-sm text-muted-foreground">{assignment.details}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
