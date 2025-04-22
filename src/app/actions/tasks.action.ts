"use server";

import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { revalidatePath } from "next/cache";

export type CreatePreventiveTaskData = {
  startDate: string;
  assetId?: number | null;
  categoryId?: number | null;
  period: string;
  description: string;
};

export async function createPreventiveTask(data: CreatePreventiveTaskData) {
  try {
    const { error } = await $fetch("/tasks/preventive", {
      method: "POST",
      body: JSON.stringify(data),
      auth: await getToken(),
    });

    if (error) {
      console.error("API Error creating preventive task:", error);
      return { success: false, message: error.message || "Failed to create task" };
    }

    // Revalidate the relevant paths
    revalidatePath("/dashboard/Planifier");
    revalidatePath("/dashboard/tasks");

    return { success: true, message: "Task scheduled successfully" };
  } catch (error) {
    console.error("Error creating preventive task:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}