"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BACKEND_URL } from "@/lib/const";
import Image from "next/image";

export const GoogleLoginButton = () => {
    return (
        <Button
            className="bg-white text-black w-full p-5 rounded-full border-2 border-gray-300 hover:bg-gray-100 flex justify-center hover:cursor-pointer"
            aria-label="Se connecter avec google"
            onClick={() => {
                window.location.href = `${BACKEND_URL}/auth/google`;
            }}
        >
            <Image src={"/static/googleLogo.png"} className="w-6" alt="google" width={400} height={400} />
        </Button>
    );
};
