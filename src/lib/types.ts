export type User = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    role: "STAFF" | "TECHNICIAN" | "ADMIN";
    approvalStatus: "UNSET" | "PENDING" | "VALIDATED";
};

export type Technician = User & {
    technicianData: {
        userId: number;
        availabilities: Availability[];
        profession: Profession;
        createdAt: string;
        phoneNumber: number;
    };
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

export enum AssetType {
    BUILDING = "BUILDING",
    ROOM = "ROOM",
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
}
