"use server";

import { revalidatePath } from "next/cache";
import { $fetch } from "../fetch";
import { getToken } from "../getToken";

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
