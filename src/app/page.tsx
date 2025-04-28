import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BACKEND_URL } from "@/lib/const";
import {
    ArrowRight,
    BarChart3,
    Building2,
    CalendarClock,
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
    GanttChartSquare,
    LogOut,
    Settings,
    Shield,
    UserCheck,
    Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "./actions/get-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Home() {
    // Get current user (if logged in)
    const user = await getUser();

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <header className="bg-card border-b border-border/40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Image src="/static/grayLogo.svg" className="w-10" alt="ESI Logo" width={40} height={40} />
                        <p className="font-semibold text-xl">
                            <span className="text-persian-green">ESI</span>Maint
                        </p>
                    </div>
                    {!user ? (
                        <Link href="/login">
                            <Button className="bg-persian-green hover:bg-persian-green/90 text-white">
                                Se connecter
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            {user.role !== "STAFF" && (
                                <Link href="/dashboard">
                                    <Button variant="outline">Tableau de bord</Button>
                                </Link>
                            )}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-md border">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">
                                        {user.name
                                            .split(" ")
                                            .map((e) => e[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{user.name}</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-card to-background">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Système de Gestion de Maintenance de l'<span className="text-persian-green">ESI</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Plateforme interne dédiée à la gestion efficace des équipements et des interventions
                                techniques au sein de l'École Supérieure d'Informatique.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {!user ? (
                                    <Link
                                        href="/login"
                                        className="bg-persian-green hover:bg-persian-green/90 text-white flex items-center px-2 rounded-lg"
                                    >
                                        Accéder à la plateforme
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                ) : (
                                    user.role !== "STAFF" && (
                                        <Link href="/dashboard">
                                            <Button
                                                size="lg"
                                                className="bg-persian-green hover:bg-persian-green/90 text-white"
                                            >
                                                Accéder au tableau de bord
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    )
                                )}
                                <Link href="/signaler">
                                    <Button size="lg" variant="outline">
                                        Signaler un problème
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-[400px] lg:h-[500px] hidden lg:block">
                            <Image
                                src="/static/bigLogo.png"
                                alt="ESI Logo Large"
                                fill
                                className="object-contain opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Fonctionnalités principales</h2>
                        <p className="text-muted-foreground">
                            Notre plateforme offre des outils puissants pour gérer efficacement la maintenance des
                            équipements de l'ESI
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<ClipboardCheck className="h-10 w-10 text-persian-green" />}
                            title="Gestion des signalements"
                            description="Soumettez et suivez facilement les rapports d'incidents techniques et les demandes d'intervention."
                        />
                        <FeatureCard
                            icon={<Building2 className="h-10 w-10 text-persian-green" />}
                            title="Gestion des actifs"
                            description="Inventoriez et surveillez tous les équipements et ressources de l'école."
                        />
                        <FeatureCard
                            icon={<CalendarClock className="h-10 w-10 text-persian-green" />}
                            title="Planification"
                            description="Organisez et planifiez efficacement les interventions de maintenance préventive et corrective."
                        />
                        <FeatureCard
                            icon={<UserCheck className="h-10 w-10 text-persian-green" />}
                            title="Gestion des techniciens"
                            description="Assignez les bonnes compétences aux interventions appropriées pour une résolution efficace."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-10 w-10 text-persian-green" />}
                            title="Tableaux de bord"
                            description="Visualisez les indicateurs clés de performance et prenez des décisions basées sur les données."
                        />
                        <FeatureCard
                            icon={<Shield className="h-10 w-10 text-persian-green" />}
                            title="Gestion des accès"
                            description="Sécurisez l'accès aux fonctionnalités selon les rôles et responsabilités."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
                        <p className="text-muted-foreground">
                            Un processus simple pour gérer efficacement la maintenance des équipements
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StepCard
                            number={1}
                            title="Signalement"
                            description="Un utilisateur signale un problème technique ou une demande de maintenance."
                        />
                        <StepCard
                            number={2}
                            title="Attribution"
                            description="Les administrateurs assignent l'intervention à un technicien qualifié."
                        />
                        <StepCard
                            number={3}
                            title="Résolution"
                            description="Le technicien intervient et documente la résolution du problème."
                        />
                        <StepCard
                            number={4}
                            title="Validation"
                            description="L'intervention est validée et les statistiques sont mises à jour."
                        />
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="lg:flex items-center gap-12">
                        <div className="lg:w-1/2 mb-10 lg:mb-0">
                            <h2 className="text-3xl font-bold mb-6">Gérez la maintenance en toute simplicité</h2>
                            <p className="text-muted-foreground mb-6">
                                Notre tableau de bord intuitif vous permet de visualiser et de gérer l'ensemble des
                                opérations de maintenance des équipements de l'ESI en un coup d'œil.
                            </p>
                            <ul className="space-y-4">
                                <FeatureItem>Vue d'ensemble des interventions en cours</FeatureItem>
                                <FeatureItem>Statistiques détaillées en temps réel</FeatureItem>
                                <FeatureItem>Gestion des utilisateurs et des permissions</FeatureItem>
                                <FeatureItem>Rapports et analyses personnalisables</FeatureItem>
                            </ul>

                            <div className="mt-8 space-y-4">
                                {user?.role === "STAFF" ? (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-amber-800">
                                            Le tableau de bord est réservé aux techniciens et administrateurs. Si vous
                                            êtes technicien ou administrateur, veuillez contacter un administrateur pour
                                            faire valider votre compte.
                                        </p>
                                    </div>
                                ) : !user ? (
                                    <>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            <strong>Vous êtes technicien ou administrateur ?</strong> Connectez-vous
                                            pour accéder au tableau de bord complet de gestion de la maintenance.
                                        </p>
                                        <Link
                                            className="text-persian-green group hover:text-persian-green/90 p-1  flex items-center"
                                            href={"/login"}
                                        >
                                            Accéder au tableau de bord
                                            <ChevronRight className="ml-1 h-4 w-4 group-hover:ml-4 duration-200" />
                                        </Link>
                                    </>
                                ) : (
                                    <Link href="/dashboard">
                                        <Button className="bg-persian-green hover:bg-persian-green/90 text-white">
                                            Accéder au tableau de bord
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="lg:w-1/2 rounded-xl overflow-hidden border border-border shadow-lg">
                            <div className="bg-sidebar p-2 flex items-center gap-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-xs text-sidebar-foreground opacity-70">ESIMaint Dashboard</div>
                            </div>
                            <div className="bg-gradient-to-br from-card to-background p-4 h-[300px] lg:h-[400px] flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <GanttChartSquare className="h-16 w-16 mx-auto text-persian-green opacity-50" />
                                    <p className="text-muted-foreground">
                                        {!user
                                            ? "Connectez-vous pour accéder au tableau de bord"
                                            : user.role === "STAFF"
                                            ? "Accès réservé aux techniciens et administrateurs"
                                            : "Accédez à votre tableau de bord complet"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-persian-green text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Prêt à améliorer la gestion de la maintenance ?</h2>
                    <p className="max-w-2xl mx-auto mb-10 opacity-90">
                        Rejoignez la plateforme interne de l'ESI et contribuez à maintenir nos équipements en parfait
                        état de fonctionnement.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {!user ? (
                            <Link href="/login">
                                <Button size="lg" variant="secondary">
                                    Se connecter
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/dashboard">
                                <Button size="lg" variant="secondary" disabled={user.role === "STAFF"}>
                                    Accéder au tableau de bord
                                </Button>
                            </Link>
                        )}
                        <Link href="/signaler">
                            <Button
                                size="lg"
                                className=" text-white bg-hint-text   hover:bg-white hover:text-persian-green"
                            >
                                Signaler un problème
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border/40 py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-4 mb-6 md:mb-0">
                            <Image src="/static/grayLogo.svg" className="w-8" alt="ESI Logo" width={32} height={32} />
                            <div>
                                <p className="font-semibold">
                                    <span className="text-persian-green">ESI</span>Maint
                                </p>
                                <p className="text-xs text-muted-foreground">Système de Gestion de Maintenance</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex gap-4 mb-2">
                                <Link
                                    href="https://www.esi.dz/"
                                    target="_blank"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Site officiel ESI
                                </Link>
                                <Separator orientation="vertical" className="h-4" />
                                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                                    Dashboard
                                </Link>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} École Supérieure d'Informatique. Tous droits réservés.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <Card className="transition-all hover:shadow-md hover:border-persian-green/20">
            <CardHeader>
                <div className="mb-4">{icon}</div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-base">{description}</CardDescription>
            </CardContent>
        </Card>
    );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
    return (
        <Card className="relative border-border/40 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-persian-green/10 rounded-full"></div>
            <CardHeader className="pb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-persian-green/20 text-persian-green font-bold mb-2">
                    {number}
                </span>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-base">{description}</CardDescription>
            </CardContent>
        </Card>
    );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-persian-green mt-0.5" />
            <span>{children}</span>
        </li>
    );
}
