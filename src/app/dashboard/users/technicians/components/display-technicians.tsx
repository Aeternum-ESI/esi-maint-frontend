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
import { PopoverClose } from "@radix-ui/react-popover";
import { updateTechnicianAvailability, updateTechnicianProfession } from "@/app/actions/updateTechnician";

export const DisplayTechnicians = ({
    technicians,
    professions,
}: {
    technicians: Technician[];
    professions: Profession[];
}) => {
    const [roleFilter, setRoleFilter] = useState<string>("");

    const filteredTechnicians = roleFilter
        ? technicians.filter((p) => p.name.toLowerCase().includes(roleFilter.toLowerCase()))
        : technicians;
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className=" h-8  gap-1 w-fit">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filter</span>
                        {roleFilter && <span className="rounded-md bg-muted px-1.5 text-xs font-medium">1</span>}
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
                                    onSelect={(value) => {
                                        setRoleFilter(value === roleFilter ? "" : value);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            roleFilter === profession.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {profession.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                {filteredTechnicians.map((technician) => (
                    <TechnicianCard key={technician.id} technician={technician} professions={professions} />
                ))}
            </div>
        </>
    );
};

const TechnicianCard = ({ technician, professions }: { technician: Technician; professions: Profession[] }) => {
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={technician.avatarUrl || null} alt={technician.name} />
                        <AvatarFallback>{technician.name?.charAt(0) || "T"}</AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className="ml-2">
                        Technician
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
                        <Calendar className="h-4 w-4 mr-1" /> Registered on:{" "}
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
                        <Clock className="h-4 w-4 mr-1" /> Availability:{" "}
                        {technician.technicianData.availabilities
                            ? `${technician.technicianData.availabilities.length} time slot(s)`
                            : "Not specified"}
                    </p>
                    <Badge
                        className="m-2"
                        variant={technician.approvalStatus === "VALIDATED" ? "success" : "destructive"}
                    >
                        {technician.approvalStatus === "VALIDATED" ? "Validated" : "Not validated"}
                    </Badge>
                </div>
            </CardContent>

            <CardFooter>
                <TechnicianDetails technician={technician} professions={professions} />
            </CardFooter>
        </Card>
    );
};

export const TechnicianDetails = ({
    technician,
    professions,
}: {
    technician: Technician;
    professions: Profession[];
}) => {
    const [isEditingAvailabilities, setIsEditingAvailabilities] = useState(false);
    const [selectedProfession, setSelectedProfession] = useState(technician.technicianData.profession?.id || 0);
    const [availabilities, setAvailabilities] = useState([...(technician.technicianData.availabilities || [])]);
    const [isLoading, setIsLoading] = useState(false);

    // Store original availabilities for cancellation
    const originalAvailabilities = [...(technician.technicianData.availabilities || [])];

    // Add/remove availability slots
    const addAvailability = () => {
        // Find a day that hasn't been used yet
        const usedDays = availabilities.map((a) => a.day);
        const availableDays: Day[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
        const unusedDays = availableDays.filter((day) => !usedDays.includes(day));

        // If there are no unused days, don't add a new slot
        if (unusedDays.length === 0) {
            toast("Warning", {
                description: "All days are already used",
            });
            return;
        }

        // Add a new availability with the first unused day
        setAvailabilities([...availabilities, { day: unusedDays[0], startHour: 8, endHour: 17 }]);
    };

    const removeAvailability = (index: number) => {
        setAvailabilities(availabilities.filter((_, i) => i !== index));
    };

    const updateAvailability = (index: number, field: keyof (typeof availabilities)[0], value: any) => {
        // If updating the day, check if it's already used
        if (field === "day") {
            const existingDayIndex = availabilities.findIndex((a, i) => i !== index && a.day === value);
            if (existingDayIndex !== -1) {
                toast("Error", {
                    description: `${formatDay(value as Day)} is already used`,
                });
                return;
            }
        }

        const updated = [...availabilities];
        updated[index] = { ...updated[index], [field]: value };
        setAvailabilities(updated);
    };

    const saveProfession = async (technicianId: number, professionId: number) => {
        const error = await updateTechnicianProfession(technicianId, professionId);
        if (error) {
            console.error("Failed to update profession:", error);
            return toast("Error", {
                description: "Unable to update the profession",
            });
        }
        toast("Success", {
            description: "Profession updated successfully",
        });
    };

    const saveAvailabilities = async () => {
        try {
            setIsLoading(true);

            const mappedAvailabilities = availabilities.map((availability) => {
                return {
                    day: availability.day,
                    startHour: availability.startHour,
                    endHour: availability.endHour,
                };
            });
            await updateTechnicianAvailability(technician.id, mappedAvailabilities);
            toast("Success", {
                description: "Availabilities updated successfully",
            });
            setIsEditingAvailabilities(false);
        } catch (error) {
            console.error("Failed to update availabilities:", error);
            toast("Error", {
                description: "Unable to update availabilities",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to display day in English
    const formatDay = (day: Day) => {
        const dayMap: Record<Day, string> = {
            MONDAY: "Monday",
            TUESDAY: "Tuesday",
            WEDNESDAY: "Wednesday",
            THURSDAY: "Thursday",
            FRIDAY: "Friday",
            SATURDAY: "Saturday",
            SUNDAY: "Sunday",
        };
        return dayMap[day];
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    View details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center max-sm:justify-center">
                        <User className="h-5 w-5 mr-2" />
                        {technician.name}
                    </DialogTitle>
                    <DialogDescription>Complete technician information</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="grid grid-cols-[100px_1fr] items-center">
                        <span className="font-semibold">Email:</span>
                        <span>{technician.email}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center">
                        <span className="font-semibold">Phone:</span>
                        <span>{technician.technicianData.phoneNumber || "Not specified"}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] items-center">
                        <span className="font-semibold">Status:</span>
                        <Badge variant={technician.approvalStatus === "VALIDATED" ? "success" : "destructive"}>
                            {technician.approvalStatus === "VALIDATED" ? "Validated" : "Not validated"}
                        </Badge>
                    </div>

                    {/* Profession Section */}
                    <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Profession:</span>
                            <Popover>
                                <PopoverTrigger asChild className="[&>span]:truncate py-5">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2 flex justify-between h-8 gap-1 w-42 "
                                    >
                                        <span>{professions.find((e) => e.id === selectedProfession)?.name}</span>

                                        <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command autoSave="true">
                                        <CommandInput placeholder="Search ..." />
                                        <CommandEmpty>No role found.</CommandEmpty>

                                        <CommandGroup>
                                            {professions.map((profession) => (
                                                <PopoverClose key={profession.id} className="w-full h-full">
                                                    <CommandItem
                                                        value={profession.name}
                                                        onSelect={async () => {
                                                            setSelectedProfession(profession.id);
                                                            await saveProfession(technician.id, profession.id);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedProfession === profession.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {profession.name}
                                                    </CommandItem>
                                                </PopoverClose>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Availabilities Section */}
                    <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Availabilities:</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (isEditingAvailabilities) {
                                        // Cancel: reset to original state
                                        setAvailabilities([...originalAvailabilities]);
                                    }
                                    setIsEditingAvailabilities(!isEditingAvailabilities);
                                }}
                                className="h-8 px-2"
                                disabled={isLoading}
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                {isEditingAvailabilities ? "Cancel" : "Edit"}
                            </Button>
                        </div>

                        {isEditingAvailabilities ? (
                            <div className="space-y-4">
                                {availabilities.map((availability, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                                        <Select
                                            value={availability.day}
                                            onValueChange={(value) => updateAvailability(index, "day", value as Day)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    [
                                                        "MONDAY",
                                                        "TUESDAY",
                                                        "WEDNESDAY",
                                                        "THURSDAY",
                                                        "FRIDAY",
                                                        "SATURDAY",
                                                        "SUNDAY",
                                                    ] as Day[]
                                                ).map((day) => (
                                                    <SelectItem
                                                        key={day}
                                                        value={day}
                                                        disabled={availabilities.some(
                                                            (a, i) => i !== index && a.day === day
                                                        )}
                                                    >
                                                        {formatDay(day)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="relative">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="23"
                                                value={availability.startHour}
                                                onChange={(e) =>
                                                    updateAvailability(index, "startHour", parseInt(e.target.value))
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
                                                    updateAvailability(index, "endHour", parseInt(e.target.value))
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
                                        disabled={isLoading || availabilities.length >= 7}
                                    >
                                        + Add
                                    </Button>
                                    <Button onClick={saveAvailabilities} className="flex-1" disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Save"}
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
                                    <span className="text-sm text-gray-500">No availability specified</span>
                                )}
                            </>
                        )}
                    </div>

                    <div className="border-t pt-3">
                        <div className="grid grid-cols-[100px_1fr] items-center">
                            <span className="font-semibold">Created on:</span>
                            <span>{new Date(technician.technicianData.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <DialogTrigger asChild>
                    <DialogFooter>
                        <Button variant="outline">Close</Button>
                    </DialogFooter>
                </DialogTrigger>
            </DialogContent>
        </Dialog>
    );
};
