'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logout } from "@/app/actions/logout";
import { useEffect } from "react";

export default function LogoutPage() {
    useEffect  (() => {
        // Call the logout action to clear the access token
        logout();
    }, []);
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Déconnexion réussie</CardTitle>
                    <CardDescription>Vous avez été déconnecté de votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        Merci d'avoir utilisé notre application. Vous pouvez maintenant retourner à la page d'accueil.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/" passHref>
                    
                        <Button>Retourner à la page d'accueil</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
