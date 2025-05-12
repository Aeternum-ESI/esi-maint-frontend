"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { $fetch } from "@/app/fetch";

type UserRole = "ADMIN" | "TECHNICIAN";

type LoginFormData = {
    email: string;
    password: string;
};

export default function MockLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<UserRole>("TECHNICIAN");
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, role: UserRole) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mock authentication - would be replaced with actual API call
            const response = await $fetch("auth/mocklogin", {
                method: "POST",
                body: JSON.stringify({
                    role,
                })
            });
            const  token  = response.data?.data;

            // Mock successful login
            toast(`Login Successful.`, {
                description() {
                    return (
                        <div className="text-sm">
                            You've been logged in as a {role}.
                        </div>
                    );
                }
            },);



            // Redirect to dashboard after successful login
            router.push("/oauth?token=" + token);
        } catch (error) {
            toast("Login Failed. An error occurred during login.", {
                description() {
                    return (
                        <div className="text-sm">
                            Please check your credentials and try again.
                        </div>
                    );
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md p-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Mock Login</CardTitle>
                    <CardDescription>
                        For teacher testing purposes only
                    </CardDescription>
                </CardHeader>
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as UserRole)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="TECHNICIAN">Technician</TabsTrigger>
                        <TabsTrigger value="ADMIN">Admin</TabsTrigger>
                    </TabsList>

                    <TabsContent value="TECHNICIAN">
                        <form onSubmit={(e) => handleSubmit(e, "TECHNICIAN")}>
                            <CardContent className="space-y-4 pt-4">
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login as Technician"}
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="ADMIN">
                        <form onSubmit={(e) => handleSubmit(e, "ADMIN")}>
                            <CardContent className="space-y-4 pt-4">

                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login as Admin"}
                                </Button>
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
