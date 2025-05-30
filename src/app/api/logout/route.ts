import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request){

    const cookieStore = await cookies();
    cookieStore.delete("access_token");

    return NextResponse.json({ 
                message: "Déconnexion réussie"
            });
}