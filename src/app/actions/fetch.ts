import { BACKEND_URL } from "@/lib/const";
import { createFetch } from "@better-fetch/fetch";
import { z } from "zod";

export const $fetch = createFetch({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    defaultOutput: z.object({
        status: z.string(),
        message: z.string(),
        code: z.number(),
        data: z.any(),
    }),
});
