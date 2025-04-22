import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon, Clock } from "lucide-react";
import { InterventionRequestStatus, Priority, ReportStatus } from "@/lib/types";
import { JSX } from "react";

/**
 * Get CSS class for priority-based row coloring
 */
export function getPriorityRowClass(priority: Priority): string {
    switch (priority) {
        case "HIGH":
            return "bg-red-100 hover:bg-red-100 border-l-4 border-red-500";
        case "MEDIUM":
            return "bg-yellow-50 hover:bg-yellow-50 border-l-4 border-yellow-500";
        case "LOW":
            return "bg-green-50 hover:bg-green-50 border-l-4 border-green-500";
        default:
            return "";
    }
}

/**
 * Get CSS class for priority badge coloring
 */
export function getPriorityBadgeClass(priority: Priority): string {
    switch (priority) {
        case "HIGH":
            return "bg-red-500 hover:bg-red-600";
        case "MEDIUM":
            return "bg-yellow-500 hover:bg-yellow-600";
        case "LOW":
            return "bg-green-500 hover:bg-green-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
}

/**
 * Get status badge component with appropriate styling
 */
export function getStatusBadge(status: ReportStatus): JSX.Element {
    switch (status) {
        case "PENDING":
            return (
                <Badge className="bg-purple-500">
                    <Clock className="h-3 w-3 mr-1" /> Pending
                </Badge>
            );
        case "ASSIGNED":
            return (
                <Badge className="bg-blue-500">
                    <CheckIcon className="h-3 w-3 mr-1" /> Assigned
                </Badge>
            );
        case "CANCELED":
            return (
                <Badge className="bg-red-500">
                    <XIcon className="h-3 w-3 mr-1" /> Canceled
                </Badge>
            );
        case "TREATED":
            return (
                <Badge className="bg-green-500">
                    <CheckIcon className="h-3 w-3 mr-1" /> Treated
                </Badge>
            );
        default:
            return (
                <Badge>
                    <Clock className="h-3 w-3 mr-1" /> Unknown
                </Badge>
            );
    }
}

/**
 * Get badge class for intervention request status
 */
export function getInterventionStatusBadgeClass(status: InterventionRequestStatus): string {
    switch (status) {
        case "COMPLETED":
            return "bg-green-500";
        case "OVERDUE":
            return "bg-red-500";
        case "IN_PROGRESS":
            return "bg-blue-500";
        default:
            return "bg-gray-500";
    }
}

/**
 * Format date string for display
 */
export function formatDate(dateString: string): string {
    return format(new Date(dateString), "PPP");
}

/**
 * Format date with time for detailed display
 */
export function formatDateTime(dateString: string): string {
    return format(new Date(dateString), "PPP 'at' p");
}
