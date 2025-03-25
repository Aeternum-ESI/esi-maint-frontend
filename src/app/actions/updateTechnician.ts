"use server";

import { revalidatePath } from "next/cache";
import { $fetch } from "../fetch";
import { getToken } from "../getToken";
import { Availability } from "@/lib/types";

export const updateTechnicianProfession = async (id: number, professionId: number) => {
    const { data, error } = await $fetch(`/technicians/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            professionId,
        }),
        auth: await getToken(),
    });
    if (error) console.log(error);
    revalidatePath("/dashboard/users/technicians");
    return error;
};

export const updateTechnicianAvailability = async (id: number, availabilities: Availability[]) => {
    const { data, error } = await $fetch(`/technicians/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            availabilities,
        }),
        auth: await getToken(),
    });
    if (error) console.log(error);
    revalidatePath("/dashboard/users/technicians");
    return error;
};
