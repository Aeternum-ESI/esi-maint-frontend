import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./app/actions/get-user";

// export async function middleware(req: NextRequest) {
//     const cookieStore = await cookies();

//     if (req.nextUrl.pathname.startsWith("/oauth")) {
//         const oAuthToken = req.nextUrl.searchParams.get("token") || "";

//         if (oAuthToken.length > 0) {
//             cookieStore.set("access_token", oAuthToken, {
//                 httpOnly: true,
//             });

//             return NextResponse.redirect(new URL("/dashboard", req.url));
//         }
//         return NextResponse.redirect(new URL("/login", req.url));
//     }

//     const token = cookieStore.get("access_token")?.value;

//     const response = await fetch("http://localhost:4000/auth/me", {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) {
//         if (req.nextUrl.pathname === "/login") {
//             return NextResponse.next();
//         }
//         return NextResponse.redirect(new URL("/login", req.url));
//     }
// }

export const middleware = async (req: NextRequest) => {
    const cookieStore = await cookies();

    if (req.nextUrl.pathname.startsWith("/oauth")) {
        const oAuthToken = req.nextUrl.searchParams.get("token") || "";

        if (oAuthToken.length > 0) {
            cookieStore.set("access_token", oAuthToken, {
                httpOnly: true,
            });

            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/dashboard")) {
        const user = await getUser();

        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (user.role === "STAFF" && user.approvalStatus === "VALIDATED") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (user.approvalStatus === "UNSET") {
            return NextResponse.redirect(new URL("/approval", req.url));
        }

        return NextResponse.next();
    }

    NextResponse.next();
};

export const config = {
    matcher: ["/((?!api|_next/static|static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
