"use client";

import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

export const NavHeader = () => {
    const { isMobile, open } = useSidebar();
    return (
        <>
            <SidebarHeader className="flex items-center  flex-row justify-center gap-2 mt-2">
                <Image src={"/static/grayLogo.png"} className="w-10 " alt="" width={400} height={400} />
                {!isMobile && open && (
                    <p className="font-semibold text-xl">
                        <span className="text-persian-green">ESI</span>Maint
                    </p>
                )}
            </SidebarHeader>
        </>
    );
};
