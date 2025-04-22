"use server";

import { revalidatePath } from "next/cache";
import { $fetch } from "../fetch";
import { getToken } from "../getToken";
import { CreateInterventionRequestPayload } from "@/lib/types";

// Get all intervention requests
export const getAllInterventionRequests = async () => {
    const response = await $fetch("/intervention-requests", {
        method: "GET",
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }

    return response.data?.data;
};

// Get intervention requests for the current user
export const getMyInterventionRequests = async () => {
    const response = await $fetch("/intervention-requests/me", {
        method: "GET",
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }

    return response.data?.data;
};

// Get a specific intervention request by ID
export const getInterventionRequestById = async (id: number) => {
    const response = await $fetch(`/intervention-requests/${id}`, {
        method: "GET",
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }

    return response.data?.data;
};

// Create a new intervention request
export const createInterventionRequest = async (payload: CreateInterventionRequestPayload) => {
    // Ensure the deadline is properly formatted as ISO string
    // The backend expects a string in a valid date format
    const formattedPayload = {
        ...payload,
    };

    const response = await $fetch("/intervention-requests", {
        method: "POST",
        body: JSON.stringify(formattedPayload),
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/reports");

    return response.data?.data;
};

// Update an intervention request
export const updateInterventionRequest = async (id: number, updateData: Partial<CreateInterventionRequestPayload>) => {
    // Ensure deadline is properly formatted if present
    const formattedUpdateData = {
        ...updateData,
    };

    const response = await $fetch(`/intervention-requests/${id}`, {
        method: "PUT",
        body: JSON.stringify(formattedUpdateData),
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/reports");

    return response.data?.data;
};

// Complete an intervention request
export const completeInterventionRequest = async (id: number, description: string) => {
    const response = await $fetch(`/intervention-requests/${id}/complete`, {
        method: "POST",
        body: JSON.stringify({ description }),
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/reports");

    return response.data?.data;
};
