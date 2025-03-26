"use server";

import { revalidatePath } from "next/cache";
import { $fetch } from "../fetch";
import { getToken } from "../getToken";

export const createCategory = async (category: { name: string; description: string; parentId: number | null }) => {
    console.log(category);
    const response = await $fetch("/categories", {
        method: "POST",
        body: JSON.stringify(category),
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }
    revalidatePath("/dashboard/assets");
};

export const deleteCategory = async (id: number) => {
    const response = await $fetch(`/categories/${id}`, {
        method: "DELETE",
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }
    revalidatePath("/dashboard/assets");
};

export const updateCategory = async (
    id: number,
    category: { name?: string; description?: string; parentId?: number | null }
) => {
    const response = await $fetch(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(category),
        auth: await getToken(),
    });

    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }
    revalidatePath("/dashboard/assets");
};
