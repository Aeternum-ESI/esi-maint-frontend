"use server";

import { $fetch } from "../fetch";
import { getToken } from "../getToken";

export const fetchTechStats = async () => {
    return await $fetch("/stats/technicians/stats", {
        auth: await getToken(),
    });
};

export const fetchRepStats = async () => {
    return await $fetch("/stats/reports/over-time", {
        auth: await getToken(),
    });
};
