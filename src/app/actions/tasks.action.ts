"use server";

import { $fetch } from "../fetch";
import { getToken } from "../getToken";
import { Priority, Schedule } from "@/lib/types";
import { revalidatePath } from "next/cache";

// Existing code for CreatePreventiveTaskData interface and createPreventiveTask function
export interface CreatePreventiveTaskData {
    lastMaintenanceDate: string;
    frequency: number;
    description: string;
    priority: Priority;
    assetId: number | null;
    categoryId: number | null;
}

export async function createPreventiveTask(data: CreatePreventiveTaskData) {
    try {
        const { error } = await $fetch("/reports/schedules", {
            method: "POST",
            body: JSON.stringify(data),
            auth: await getToken(),
        });

        console.log("Response from API:", error);

        if (error) {
            console.error("API Error creating preventive task:", error);
            return { success: false, message: error.message || "Failed to create task" };
        }

        // Revalidate the relevant paths
        revalidatePath("/dashboard/planifier");
        revalidatePath("/dashboard/tasks");

        return { success: true, message: "Task scheduled successfully" };
    } catch (error) {
        console.error("Error creating preventive task:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}

// New function to get all scheduled tasks
export async function getScheduledTasks(): Promise<Schedule[]> {
    try {
        const response = await $fetch("reports/schedules", {
            method: "GET",
            auth: await getToken(),
        });

        if (response.error) {
            throw new Error(JSON.stringify(response.error));
        }

        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching scheduled tasks:", error);
        return [];
    }
}

// Function to delete a scheduled task
export async function deleteScheduledTask(id: number): Promise<{ success: boolean; message: string }> {
    try {
        const response = await $fetch(`reports/schedules/${id}`, {
            method: "DELETE",
            auth: await getToken(),
        });

        if (response.error) {
            throw new Error(JSON.stringify(response.error.message));
        }

        revalidatePath("/dashboard/Planifier");
        return { success: true, message: "Tâche planifiée supprimée avec succès" };
    } catch (error) {
        console.error("Error deleting scheduled task:", error);
        return { success: false, message: "Une erreur est survenue lors de la suppression" };
    }
}
