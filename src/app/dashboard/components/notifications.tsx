import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Bell, Haze } from "lucide-react";
import { revalidatePath } from "next/cache";

export const Notifications = async () => {
    const { data } = await $fetch("users/notifications", {
        auth: await getToken(),
    });

    const notifcations: {
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
    }[] = data?.data;

    return (
        <>
            <Popover>
                <form
                    action={async () => {
                        "use server";
                        await $fetch("users/readnotifications", {
                            auth: await getToken(),
                            method: "POST",
                        });
                    }}
                >
                    <PopoverTrigger className="cursor-pointer" type="submit">
                        <div className="relative ">
                            <Bell size={28} />
                            {notifcations.some((notifcations) => !notifcations.read) && (
                                <div className="w-4 h-4 bg-error absolute -top-1 -right-1 rounded-full flex items-center justify-center text-xs text-isabelline">
                                    {notifcations.filter((notifcations) => !notifcations.read).length > 9
                                        ? "9+"
                                        : notifcations.filter((notifcations) => !notifcations.read).length}
                                </div>
                            )}
                        </div>
                    </PopoverTrigger>
                </form>
                <PopoverContent className="w-96 p-4 mx-4 !text-xs h-96 overflow-auto relative">
                    {notifcations.length > 0 && (
                        <div className="flex justify-end py-2 sticky top-0 z-10 ">
                            <form
                                className="w-fit "
                                action={async () => {
                                    "use server";
                                    await $fetch("users/notifications", {
                                        auth: await getToken(),
                                        method: "DELETE",
                                    });
                                    revalidatePath("/dashboard");
                                }}
                            >
                                <button className="hover:cursor-pointer text-muted-foreground w-fit bg-white rounded-lg p-2" type="submit">
                                    Clear all notifications
                                </button>
                            </form>
                        </div>
                    )}
                    {notifcations.length === 0 && (
                        <div className="text-center  flex flex-col font-bold items-center justify-center py-8 text-oxford-blue text-lg">
                            <Haze size={50} />
                            Nothing to report!
                        </div>
                    )}

                    {notifcations.map((notification, index) => (
                        <div
                            key={index}
                            className={cn("p-2 mb-1 relative ", !notification.read ? "bg-muted" : "bg-white")}
                        >
                            <div className="font-semibold text-sm">{notification.title}</div>
                            <div>{notification.message}</div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-error absolute top-1 right-1 rounded-full flex items-center justify-center text-xs text-isabelline" />
                            )}
                        </div>
                    ))}
                </PopoverContent>
            </Popover>
        </>
    );
};
