"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "../getToken";
import { $fetch } from "./fetch";

export const changeRole = async (id: number, role: "ADMIN" | "TECHNICIAN" | "STAFF") => {
    await $fetch(`users/${id}/setrole`, {
        method: "POST",
        body: JSON.stringify({ role }),
        auth: await getToken(),
    });

    revalidatePath("/dashboard/users/all");
};
