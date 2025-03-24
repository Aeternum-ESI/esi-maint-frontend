import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { GoogleLoginButton } from "./components/GoogleLoginButton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
    return (
        <>
            <Image
                src={"/static/bigLogo.png"}
                className="w-[70%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]"
                alt=""
                width={1000}
                height={1000}
            />
            <div className="w-full h-full flex justify-center items-center ">
                <Card className="max-w-[600px] w-[calc(100%-4rem)] opacity-100 h-[400px]">
                    <CardHeader className="flex items-center text-base flex-col">
                        <div className="flex items-center gap-2">
                            <Image src={"/static/grayLogo.png"} className="w-10 " alt="" width={400} height={400} />
                            <p className="font-semibold text-xl">
                                <span className="text-persian-green">ESI</span>Maint
                            </p>
                        </div>
                        <CardTitle className="text-lg">Se connecter avec google </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center">
                        <GoogleLoginButton />
                        <div className=" py-4 grid grid-cols-2   w-full gap-24">
                            <Separator className="place-self-start" />
                            <Separator className="place-self-end" />
                        </div>

                        <CardTitle className="">Vous êtes externes ? </CardTitle>
                        <CardDescription className="text-center text-sm">
                            Vous pouvez vous demander un compte pour accéder à l'application
                        </CardDescription>
                        <form className=" flex flex-col gap-2 p-4 w-full">
                            <Label htmlFor="email" className="text-muted-foreground ml-1 ">
                                Email
                            </Label>
                            <Input placeholder="example@gmail.com" id="email" className="rounded-full p-4" />
                            <Button className="bg-persian-green text-white rounded-full p-4 mt-4 hover:bg-grey-blue">
                                Demander un compte
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default LoginPage;
