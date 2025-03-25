"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Day, Profession, Technician } from "@/lib/types";
import { Calendar, Clock, Edit, Mail, User, Briefcase, Filter, ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export const DisplayTechnicians = ({
    technicians,
    professions,
}: {
    technicians: Technician[];
    professions: Profession[];
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {technicians.map((technician) => (
                <TechnicianCard key={technician.id} technician={technician} professions={professions} />
            ))}
        </div>
    );
};

const TechnicianCard = ({ technician, professions }: { technician: Technician; professions: Profession[] }) => {
    const [isEditingProfession, setIsEditingProfession] = useState(false);
    const [isEditingAvailabilities, setIsEditingAvailabilities] = useState(false);
    const [selectedProfession, setSelectedProfession] = useState(technician.technicianData.profession?.id || 0);
    const [availabilities, setAvailabilities] = useState([...(technician.technicianData.availabilities || [])]);
    const [isLoading, setIsLoading] = useState(false);

    // Add/remove availability slots
    const addAvailability = () => {
        setAvailabilities([
            ...availabilities,
            { technicianId: technician.id, day: "MONDAY" as Day, startHour: 8, endHour: 17 },
        ]);
    };

    const removeAvailability = (index: number) => {
        setAvailabilities(availabilities.filter((_, i) => i !== index));
    };

    const updateAvailability = (index: number, field: keyof (typeof availabilities)[0], value: any) => {
        const updated = [...availabilities];
        updated[index] = { ...updated[index], [field]: value };
        setAvailabilities(updated);
    };

    const saveProfession = async () => {
        try {
            setIsLoading(true);
            // API call to update profession
            // await $fetch(`/technicians/${technician.id}/profession`, {
            //     method: "PUT",
            //     auth: await getToken(),
            //     body: JSON.stringify({ professionId: selectedProfession }),
            // });

            toast("Succès", {
                description: "Profession mise à jour avec succès",
            });
            setIsEditingProfession(false);
        } catch (error) {
            console.error("Failed to update profession:", error);
            toast("Erreur", {
                description: "Impossible de mettre à jour la profession",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const saveAvailabilities = async () => {
        try {
            setIsLoading(true);
            // API call to update availabilities
            // await $fetch(`/technicians/${technician.id}/availabilities`, {
            //     method: "PUT",
            //     auth: await getToken(),
            //     body: JSON.stringify({ availabilities }),
            // });

            toast("Succès", {
                description: "Disponibilités mises à jour avec succès",
            });
            setIsEditingAvailabilities(false);
        } catch (error) {
            console.error("Failed to update availabilities:", error);
            toast("Erreur", {
                description: "Impossible de mettre à jour les disponibilités",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to display day in French
    const formatDay = (day: Day) => {
        const dayMap: Record<Day, string> = {
            MONDAY: "Lundi",
            TUESDAY: "Mardi",
            WEDNESDAY: "Mercredi",
            THURSDAY: "Jeudi",
            FRIDAY: "Vendredi",
            SATURDAY: "Samedi",
            SUNDAY: "Dimanche",
        };
        return dayMap[day];
    };

    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={technician.avatarUrl || ""} alt={technician.name} />
                        <AvatarFallback>{technician.name?.charAt(0) || "T"}</AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className="ml-2">
                        Technicien
                    </Badge>
                </div>
                <CardTitle className="mt-2">{technician.name}</CardTitle>
                <CardDescription className="flex flex-col   ">
                    <div className="flex items-center   ">
                        <Mail className="h-4 w-4 mr-1" /> {technician.email}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-1 text-sm">
                    <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Inscrit le:{" "}
                        {new Date(technician.technicianData.createdAt).toLocaleDateString()}
                    </p>
                    {technician.technicianData.profession && (
                        <p className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" /> Profession:{" "}
                            <Badge variant="outline" className="ml-1 px-2 py-0 h-5">
                                {technician.technicianData.profession.name}
                            </Badge>
                        </p>
                    )}
                    <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Disponibilité:{" "}
                        {technician.technicianData.availabilities
                            ? `${technician.technicianData.availabilities.length} plage(s) horaire`
                            : "Non spécifiée"}
                    </p>
                    <Badge
                        className="m-2"
                        variant={technician.approvalStatus === "VALIDATED" ? "success" : "destructive"}
                    >
                        {technician.approvalStatus === "VALIDATED" ? "Validé" : "Non validé"}
                    </Badge>
                </div>
            </CardContent>

            <CardFooter>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            Voir les détails
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                {technician.name}
                            </DialogTitle>
                            <DialogDescription>Informations complètes du technicien</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid grid-cols-[100px_1fr] items-center">
                                <span className="font-semibold">Email:</span>
                                <span>{technician.email}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-center">
                                <span className="font-semibold">Téléphone:</span>
                                <span>{technician.technicianData.phoneNumber || "Non spécifié"}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-center">
                                <span className="font-semibold">Statut:</span>
                                <Badge variant={technician.approvalStatus === "VALIDATED" ? "success" : "destructive"}>
                                    {technician.approvalStatus === "VALIDATED" ? "Validé" : "Non validé"}
                                </Badge>
                            </div>

                            {/* Profession Section */}
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Profession:</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditingProfession(!isEditingProfession)}
                                        className="h-8 px-2"
                                        disabled={isLoading}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        {isEditingProfession ? "Annuler" : "Modifier"}
                                    </Button>
                                </div>

                                {isEditingProfession ? (
                                    <div className="space-y-3">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="ml-2 h-8 gap-1">
                                                    <Filter className="h-3.5 w-3.5" />
                                                    <span>Filter</span>

                                                    <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search role..." />
                                                    <CommandEmpty>No role found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {professions.map((profession) => (
                                                            <CommandItem
                                                                key={profession.id}
                                                                value={profession.name}
                                                                onSelect={(value) => {}}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        technician.technicianData.profession.name ===
                                                                            profession.name
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {profession.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                ) : (
                                    <div>
                                        {technician.technicianData.profession ? (
                                            <Badge className="px-3 py-1">
                                                <Briefcase className="h-3 w-3 mr-1" />
                                                {technician.technicianData.profession.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm text-gray-500">Non spécifiée</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Availabilities Section */}
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Disponibilités:</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditingAvailabilities(!isEditingAvailabilities)}
                                        className="h-8 px-2"
                                        disabled={isLoading}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        {isEditingAvailabilities ? "Annuler" : "Modifier"}
                                    </Button>
                                </div>

                                {isEditingAvailabilities ? (
                                    <div className="space-y-4">
                                        {availabilities.map((availability, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
                                            >
                                                <Select
                                                    value={availability.day}
                                                    onValueChange={(value) =>
                                                        updateAvailability(index, "day", value as Day)
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MONDAY">{formatDay("MONDAY")}</SelectItem>
                                                        <SelectItem value="TUESDAY">{formatDay("TUESDAY")}</SelectItem>
                                                        <SelectItem value="WEDNESDAY">
                                                            {formatDay("WEDNESDAY")}
                                                        </SelectItem>
                                                        <SelectItem value="THURSDAY">
                                                            {formatDay("THURSDAY")}
                                                        </SelectItem>
                                                        <SelectItem value="FRIDAY">{formatDay("FRIDAY")}</SelectItem>
                                                        <SelectItem value="SATURDAY">
                                                            {formatDay("SATURDAY")}
                                                        </SelectItem>
                                                        <SelectItem value="SUNDAY">{formatDay("SUNDAY")}</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        value={availability.startHour}
                                                        onChange={(e) =>
                                                            updateAvailability(
                                                                index,
                                                                "startHour",
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="w-full pr-5"
                                                        disabled={isLoading}
                                                    />
                                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                                        h
                                                    </span>
                                                </div>

                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        value={availability.endHour}
                                                        onChange={(e) =>
                                                            updateAvailability(
                                                                index,
                                                                "endHour",
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="w-full pr-5"
                                                        disabled={isLoading}
                                                    />
                                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                                        h
                                                    </span>
                                                </div>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeAvailability(index)}
                                                    className="px-2"
                                                    disabled={isLoading}
                                                >
                                                    &times;
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={addAvailability}
                                                className="flex-1"
                                                disabled={isLoading}
                                            >
                                                + Ajouter
                                            </Button>
                                            <Button
                                                onClick={saveAvailabilities}
                                                className="flex-1"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Enregistrement..." : "Enregistrer"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {availabilities.length > 0 ? (
                                            <div className="ml-2 space-y-1">
                                                {availabilities.map((availability, index) => (
                                                    <div key={index} className="flex items-center text-sm">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        <span>
                                                            {formatDay(availability.day)}: {availability.startHour}h -{" "}
                                                            {availability.endHour}h
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                Aucune disponibilité spécifiée
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="border-t pt-3">
                                <div className="grid grid-cols-[100px_1fr] items-center">
                                    <span className="font-semibold">Créé le:</span>
                                    <span>{new Date(technician.technicianData.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <DialogTrigger>
                            <DialogFooter>
                                <Button variant="outline">Fermer</Button>
                            </DialogFooter>
                        </DialogTrigger>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
};
