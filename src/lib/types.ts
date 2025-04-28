import { TechnicianDetails } from "@/app/dashboard/users/technicians/components/display-technicians";

export type User = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    role: "STAFF" | "TECHNICIAN" | "ADMIN";
    approvalStatus: "UNSET" | "PENDING" | "VALIDATED";
};

export enum Role {
    STAFF = "STAFF",
    TECHNICIAN = "TECHNICIAN",
    ADMIN = "ADMIN",
}

export enum ApprovalStatus {
    UNSET = "UNSET",
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
}

export type Technician = {
    technicianData: TechnicianData;
} & User;

export type TechnicianData = {
    userId: number;
    availabilities: Availability[];
    profession: Profession;
    createdAt: string;
    phoneNumber: number;
};

export type Availability = {
    day: Day;
    startHour: number;
    endHour: number;
};

export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type Profession = {
    id: number;
    name: string;
};

export type Category = {
    id: number;
    name: string;
    description: string;
    parentId: number | null;
    createdAt: string;
    updatedAt: string;
    children: Category[];
};

export interface CategoryClosure {
    ancestorId: number;
    descendantId: number;
    depth: number;
    ancestor?: Category;
    descendant?: Category;
}

export enum AssetType {
    SITE = "SITE",
    ZONE = "ZONE",
    EQUIPMENT = "EQUIPMENT",
}

export enum AssetStatus {
    OPERATIONAL = "OPERATIONAL",
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
}

export interface Asset {
    id: number;
    locationId: number | null;
    categoryId: number | null;
    name: string;
    inventoryCode: string;
    status: AssetStatus;
    type: AssetType;
    createdAt: string;
    updatedAt: string;
    category: Category | null;
    location: Asset | null;
    assignements: TechnicianAssignment[]
}

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export enum ReportStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    CANCELED = "CANCELED",
    TREATED = "TREATED",
}

export enum OperationType {
    CORRECTIVE = "CORRECTIVE",
    PREVENTIVE = "PREVENTIVE",
}

export enum InterventionRequestStatus {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    OVERDUE = "OVERDUE",
}

export interface InterventionRequest {
    id: number;
    reportId: number;
    title: string;
    deadline: string;
    status: InterventionRequestStatus;
    createdBy: number;
    notified: boolean;
    createdAt: string;
    assignedTo?: TechnicianAssignment[];
    Interventions?: Intervention[];
    report?: Report;
    creator?: User;
}

export interface TechnicianAssignment {
    id: number;
    technicianId: number;
    interventionRequestId: number;
    locationId?: number | null;
    completed: boolean;
    details?: string | null;
    technician?: TechnicianData & {
        user: User;
    };
    interventionRequest?: InterventionRequest;
    location?: Asset | null;
    createdAt: string;
}

export interface TechnicianAvailability {
    technicianId: number;
    day: Day;
    startHour: number;
    endHour: number;
    technician?: Technician;
    createdAt: string;
    updatedAt: string;
}

export interface Intervention {
    id: number;
    technicianId: number;
    interventionRequestId: number;
    description: string;
    interventionRequest?: InterventionRequest;
    createdAt: string;
}

export interface Report {
    id: number;
    reporterId: number;
    assetId?: number | null;
    categoryId?: number | null;
    description?: string | null;
    imageUrl?: string | null;
    type: OperationType;
    status: ReportStatus;
    priority: Priority;
    createdAt: string;
    updatedAt: string;
    reporter?: User;
    asset?: Asset;
    category?: Category;
    interventionRequests?: InterventionRequest[] & {
        Interventions: Intervention[];
    };
}

export interface Schedule {
    id: number;
    assetId?: number | null;
    schedulerId: number;
    categoryId?: number | null;
    description?: string | null;
    lastMaintenanceDate: string;
    frequency: number;
    priority: Priority;
    asset?: Asset | null;
    category?: Category | null;
    scheduler?: User;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    read: boolean;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInterventionRequestPayload {
    reportId: number;
    title: string;
    deadline: string;
    assignedTo: {
        technicianId: number;
        locationId?: number | null;
    }[];
}
