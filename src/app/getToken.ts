import { Auth } from "@better-fetch/fetch";
import { cookies } from "next/headers";

export async function getToken(): Promise<
    {
        type: string;
        token: string | undefined;
    } & (Auth | undefined)
> {
    return {
        type: "Bearer",
        token: (await cookies()).get("access_token")?.value,
    };
}
