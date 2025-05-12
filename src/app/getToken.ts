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

type Auth = Bearer | Basic | Custom;

type Bearer = {
    type: "Bearer";
    token: typeOrTypeReturning<string | undefined>;
};

type Basic = {
    type: "Basic";
    username: typeOrTypeReturning<string | undefined>;
    password: typeOrTypeReturning<string | undefined>;
};

type Custom = {
    type: "Custom";
    prefix: typeOrTypeReturning<string | undefined>;
    value: typeOrTypeReturning<string | undefined>;
};

type typeOrTypeReturning<T> = T | (() => T);
