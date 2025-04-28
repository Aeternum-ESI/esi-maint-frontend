"use client";

import { deleteScheduledTask } from "@/app/actions/tasks.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Priority, Schedule } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarClock, Calendar as CalendarIcon, MoreHorizontal, Search, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PlannedTasksListProps = {
    scheduledTasks: Schedule[];
};

export function PlannedTasksList({ scheduledTasks }: PlannedTasksListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

    // Calculate next maintenance date
    const getNextMaintenanceDate = (task: Schedule) => {
        const lastMaintenance = new Date(task.lastMaintenanceDate);
        const nextMaintenance = new Date(lastMaintenance);
        nextMaintenance.setDate(nextMaintenance.getDate() + task.frequency);
        return nextMaintenance;
    };

    // Format frequency into human-readable text
    const formatFrequency = (days: number) => {
        if (days === 1) return "Tous les jours";
        if (days === 7) return "Toutes les semaines";
        if (days === 14) return "Toutes les 2 semaines";
        if (days === 30) return "Tous les mois";
        if (days === 90) return "Tous les trimestres";
        if (days === 180) return "Tous les semestres";
        if (days === 365) return "Tous les ans";
        return `Tous les ${days} jours`;
    };

    // Handle task deletion
    const handleDeleteTask = async (taskId: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche planifiée?")) {
            const result = await deleteScheduledTask(taskId);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        }
    };

    // Filter tasks based on search and priority
    const filteredTasks = scheduledTasks.filter((task) => {
        // Filter by search query
        const matchesSearch =
            searchQuery === "" ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by priority
        const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

    // Sort tasks by next maintenance date
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const dateA = getNextMaintenanceDate(a).getTime();
        const dateB = getNextMaintenanceDate(b).getTime();
        return dateA - dateB;
    });

    // Check if a task is due soon (next 7 days)
    const isDueSoon = (task: Schedule) => {
        const nextDate = getNextMaintenanceDate(task);
        const today = new Date();
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    };

    // Check if a task is overdue
    const isOverdue = (task: Schedule) => {
        const nextDate = getNextMaintenanceDate(task);
        const today = new Date();
        return nextDate < today;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-lg shadow-sm">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-persian-green" />
                    <Input
                        placeholder="Rechercher par description, asset ou catégorie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 border-persian-green/30 focus:border-persian-green"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[180px] border-persian-green/30">
                            <SelectValue placeholder="Filtrer par priorité" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" />
                                    <span>Toutes les priorités</span>
                                </div>
                            </SelectItem>
                            <SelectItem value={Priority.HIGH}>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span>Haute</span>
                                </div>
                            </SelectItem>
                            <SelectItem value={Priority.MEDIUM}>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span>Moyenne</span>
                                </div>
                            </SelectItem>
                            <SelectItem value={Priority.LOW}>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span>Basse</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {sortedTasks.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-b from-slate-50 to-transparent rounded-lg shadow-sm">
                    <CalendarClock className="mx-auto h-16 w-16 text-persian-green opacity-70" />
                    <h3 className="mt-4 text-lg font-medium text-persian-green">Aucune tâche planifiée</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        {searchQuery || priorityFilter !== "ALL"
                            ? "Aucun résultat ne correspond à vos critères de recherche"
                            : "Utilisez l'onglet planification pour créer une nouvelle tâche de maintenance préventive"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedTasks.map((task) => {
                        const nextMaintenanceDate = getNextMaintenanceDate(task);
                        const dueSoon = isDueSoon(task);
                        const overdue = isOverdue(task);

                        // Define gradient backgrounds based on priority
                        const getPriorityGradient = () => {
                            switch (task.priority) {
                                case Priority.HIGH:
                                    return "bg-gradient-to-r from-red-50 to-red-100";
                                case Priority.MEDIUM:
                                    return "bg-gradient-to-r from-amber-50 to-amber-100";
                                case Priority.LOW:
                                    return "bg-gradient-to-r from-green-50 to-green-100";
                                default:
                                    return "";
                            }
                        };

                        return (
                            <Card
                                key={task.id}
                                className={cn(
                                    "transition-all hover:shadow-md",
                                    overdue && "border-red-300 bg-gradient-to-r from-red-50 to-red-100",
                                    dueSoon &&
                                        !overdue &&
                                        "border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100",
                                    !dueSoon && !overdue && getPriorityGradient()
                                )}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between">
                                        <Badge
                                            variant={
                                                task.priority === Priority.HIGH
                                                    ? "destructive"
                                                    : task.priority === Priority.MEDIUM
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className={cn(
                                                "shadow-sm",
                                                task.priority === Priority.HIGH &&
                                                    "bg-gradient-to-r from-red-500 to-rose-600",
                                                task.priority === Priority.MEDIUM &&
                                                    "bg-gradient-to-r from-amber-400 to-amber-500",
                                                task.priority === Priority.LOW &&
                                                    "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none"
                                            )}
                                        >
                                            {task.priority === Priority.HIGH
                                                ? "Haute"
                                                : task.priority === Priority.MEDIUM
                                                ? "Moyenne"
                                                : "Basse"}{" "}
                                            priorité
                                        </Badge>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-persian-green hover:text-persian-green/70"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="text-red-600 hover:text-red-700 focus:text-red-700 focus:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardTitle className="text-base line-clamp-2 text-persian-green">
                                        {task.description || "Maintenance préventive planifiée"}
                                    </CardTitle>
                                    <CardDescription>
                                        {task.asset ? (
                                            <span className="flex items-center gap-1">
                                                <Tag className="h-3 w-3 text-persian-green" />
                                                <span className="font-medium text-slate-700">{task.asset.name}</span>
                                            </span>
                                        ) : task.category ? (
                                            <span className="flex items-center gap-1">
                                                <Tag className="h-3 w-3 text-persian-green" />
                                                <span className="font-medium text-slate-700">
                                                    Catégorie: {task.category.name}
                                                </span>
                                            </span>
                                        ) : (
                                            "Aucun asset ou catégorie spécifié"
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center border-l-2 border-persian-green pl-2">
                                            <CalendarIcon className="mr-2 h-4 w-4 text-persian-green" />
                                            <span>
                                                Fréquence:{" "}
                                                <span className="font-medium text-slate-900">
                                                    {formatFrequency(task.frequency)}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex items-center border-l-2 border-persian-green pl-2">
                                            <CalendarClock className="mr-2 h-4 w-4 text-persian-green" />
                                            <span>
                                                Prochaine maintenance:{" "}
                                                <span
                                                    className={cn(
                                                        "font-medium",
                                                        overdue && "text-red-600",
                                                        dueSoon && !overdue && "text-amber-600",
                                                        !dueSoon && !overdue && "text-slate-900"
                                                    )}
                                                >
                                                    {nextMaintenanceDate.toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                    {overdue && " (en retard)"}
                                                    {dueSoon && !overdue && " (bientôt)"}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <div className="w-full text-xs text-slate-500 flex justify-between border-t border-persian-green/20 pt-2">
                                        <div>
                                            <span className="text-persian-green font-medium">Créé le</span>{" "}
                                            {new Date(task.createdAt).toLocaleDateString("fr-FR")}
                                        </div>
                                        <div>
                                            <span className="text-persian-green font-medium">Par</span>{" "}
                                            {task.scheduler?.name || "Utilisateur inconnu"}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
