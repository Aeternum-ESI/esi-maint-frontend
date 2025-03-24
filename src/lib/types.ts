export type User = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    role: "STAFF" | "TECHNICIAN" | "ADMIN";
    approvalStatus: "UNSET" | "PENDING" | "VALIDATED";
};
