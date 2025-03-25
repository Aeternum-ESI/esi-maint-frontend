"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "../getToken";
import { $fetch } from "./fetch";

export const validate = async (userId: number, validated: boolean) => {
    const { error } = await $fetch(`users/${userId}/validate`, {
        method: "POST",
        body: JSON.stringify({
            isValidated: validated,
        }),
        auth: await getToken(),
    });

    console.log(error);
    revalidatePath("/dashboard/users/all");
};
