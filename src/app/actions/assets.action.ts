"use server";

import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { AssetType, AssetStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createAsset(formData: FormData) {
    try {
        const assetData = {
            name: formData.get("name") as string,
            inventoryCode: formData.get("inventoryCode") as string,
            type: formData.get("type") as AssetType,
            locationId: formData.get("locationId") ? parseInt(formData.get("locationId") as string) : null,
            categoryId: formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : null,
            // Add the image URL if it exists in the form data
            image: (formData.get("image") as string) || null,
        };

        const { data, error } = await $fetch("/assets", {
            method: "POST",
            body: JSON.stringify(assetData),
            auth: await getToken(),
        });

        if (error) {
            console.error("API Error creating asset:", error);
            return { success: false, message: error.message || "Failed to create asset" };
        }

        // Revalidate the assets page to show the new asset
        revalidatePath("/dashboard/assets");

        return { success: true, message: "Asset created successfully", data };
    } catch (error) {
        console.error("Error creating asset:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}

export async function updateAsset(id: number, formData: FormData) {
    try {
        const assetData = {
            name: formData.get("name") as string,
            inventoryCode: formData.get("inventoryCode") as string,
            type: formData.get("type") as AssetType,
            status: formData.get("status") as AssetStatus,
            locationId: formData.get("locationId") ? parseInt(formData.get("locationId") as string) : null,
            categoryId: formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : null,
            // Add the image URL if it exists in the form data
            image: (formData.get("image") as string) || null,
        };

        const { data, error } = await $fetch(`/assets/${id}`, {
            method: "PATCH",
            body: JSON.stringify(assetData),
            auth: await getToken(),
        });

        if (error) {
            console.error("API Error updating asset:", error);
            return { success: false, message: error.message || "Failed to update asset" };
        }

        revalidatePath("/dashboard/assets");
        return { success: true, message: "Asset updated successfully", data };
    } catch (error) {
        console.error("Error updating asset:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}

export async function deleteAsset(assetId: number) {
    try {
        const { data, error } = await $fetch(`/assets/${assetId}`, {
            method: "DELETE",
            auth: await getToken(),
        });

        if (error) {
            console.error("API Error deleting asset:", error);
            return { success: false, message: error.message || "Failed to delete asset" };
        }

        revalidatePath("/dashboard/assets");
        return { success: true, message: "Asset deleted successfully", data };
    } catch (error) {
        console.error("Error deleting asset:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}
