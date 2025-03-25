"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "../getToken";
import { $fetch } from "./fetch";

export const createProfession = async (name: string) => {
    const { data, error } = await $fetch("/professions", {
        method: "POST",
        body: JSON.stringify({
            name,
        }),
        auth: await getToken(),
    });
    console.log(data);
    if (error) console.log(error);

    revalidatePath("/dashboard/users/technicians");
};

export const deleteProfession = async (id: number) => {
    const { error } = await $fetch(`/professions/${id}`, {
        method: "DELETE",
        auth: await getToken(),
    });
    if (error) console.log(error);
};

export const updateProfession = async (id: number, name: string) => {
    const { error } = await $fetch(`/professions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            name,
        }),
        auth: await getToken(),
    });
    if (error) console.log(error);
};
