"use server";
import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { CreateInterventionRequestPayload, InterventionRequest, Report, Technician } from "@/lib/types";
import { ReportFormData } from "../signaler/components/report-problem-form";

/**
 * Fetch all reports
 */
export async function fetchReports(): Promise<Report[]> {
    try {
        const response = await $fetch("reports", {
            method: "GET",
            auth: await getToken(),
        });

        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch reports:", error);
        throw new Error("Failed to fetch reports. Please try again.");
    }
}

/**
 * Fetch a single report by ID
 */
export async function fetchReportById(id: string | number): Promise<Report> {
    try {
        const response = await $fetch(`reports/${id}`, {
            method: "GET",
            auth: await getToken(),
        });

        if (!response.data) {
            throw new Error("Report not found");
        }

        return response.data.data;
    } catch (error) {
        console.error(`Failed to fetch report ${id}:`, error);
        throw new Error("Failed to fetch report details. Please try again.");
    }
}

/**
 * Cancel a report
 */
export async function cancelReport(id: string | number): Promise<void> {
    try {
        await $fetch(`reports/${id}/cancel`, {
            method: "PATCH",
            auth: await getToken(),
        });
    } catch (error) {
        console.error(`Failed to cancel report ${id}:`, error);
        throw new Error("Failed to cancel the report. Please try again.");
    }
}

/**
 * Fetch all technicians
 */
export async function fetchTechnicians(): Promise<Technician[]> {
    try {
        const response = await $fetch("technicians", {
            method: "GET",
            auth: await getToken(),
        });

        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch technicians:", error);
        throw new Error("Failed to fetch technicians. Please try again.");
    }
}

/**
 * Create an intervention request and assign technicians
 */
export async function createInterventionRequest(data: CreateInterventionRequestPayload): Promise<InterventionRequest> {
    try {
        const response = await $fetch("intervention-requests", {
            method: "POST",
            body: JSON.stringify(data),
            auth: await getToken(),
        });

        console.log(response);

        if (!response.data) {
            throw new Error("Failed to create intervention request");
        }

        return response.data.data;
    } catch (error) {
        console.error("Failed to create intervention request:", error);
        throw new Error("Failed to assign technicians. Please try again.");
    }
}

export const createReport = async (data: ReportFormData) => {
    try {
        const response = await $fetch("reports", {
            method: "POST",
            body: JSON.stringify(data),
            auth: await getToken(),
        });

        console.log(response);

        if (!response.data) {
            throw new Error("Failed to create report");
        }

        return response.data.data;
    } catch (error) {
        console.error("Failed to create report:", error);
        throw new Error("Failed to create report. Please try again.");
    }
};
