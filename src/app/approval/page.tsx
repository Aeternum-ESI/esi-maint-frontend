import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser } from "../actions/get-user";
import { $fetch } from "../fetch";
import { getToken } from "../getToken";

export default async function Approval() {
    const user = await getUser();

    if (user.approvalStatus === "VALIDATED") {
        redirect("/");
    }

    return (
        <div className="w-full h-full flex items-center justify-center  relative">
            <Image
                src={"/static/bigLogo.png"}
                className="w-[70%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]"
                alt=""
                width={1000}
                height={1000}
            />
            <form
                action={async (formData) => {
                    "use server";
                    await $fetch("/users/askpromotion", {
                        auth: await getToken(),
                        method: "POST",

                        body: JSON.stringify({
                            role: formData.get("role"),
                        }),
                    });
                    redirect("/");
                }}
                className="space-y-6 p-6 bg-white rounded-lg shadow-md w-full max-w-md"
            >
                <div>
                    <h2 className="text-xl font-bold">Sélectionnez votre rôle</h2>
                    <p className="text-muted-foreground text-sm">Vous êtes connéctés en tant que {user.name}</p>
                </div>

                <RadioGroup defaultValue="STAFF" name="role" className="space-y-3">
                    <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-100 border border-slate-200">
                        <RadioGroupItem value="STAFF" id="r1" />
                        <Label htmlFor="r1" className="flex-grow py-2 cursor-pointer w-full">
                            Staff
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-100 border border-slate-200">
                        <RadioGroupItem value="TECHNICIAN" id="r2" />
                        <Label htmlFor="r2" className="flex-grow py-2 cursor-pointer w-full">
                            Technicien
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-100 border border-slate-200">
                        <RadioGroupItem value="ADMIN" id="r3" />
                        <Label htmlFor="r3" className="flex-grow py-2 cursor-pointer w-full">
                            Administrateur
                        </Label>
                    </div>
                </RadioGroup>

                <Button type="submit" className="w-full hover:cursor-pointer">
                    Submit
                </Button>
            </form>
        </div>
    );
}