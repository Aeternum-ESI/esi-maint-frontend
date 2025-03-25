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
    };
};
export type Availability = {
    technicianId: number;
    day: Day;
    startHour: number;
    endHour: number;
};

export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type Profession = {
    id: number;
    name: string;
};
