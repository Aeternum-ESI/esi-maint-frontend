import { User } from "@/lib/types";
import { cookies } from "next/headers";
import { $fetch } from "./fetch";

export const getUser = async () => {
    const token = (await cookies()).get("access_token");

    const { data } = await $fetch("/auth/me", {
        auth: {
            type: "Bearer",
            token: token?.value,
        },
    });

    return data?.data as User;
};
