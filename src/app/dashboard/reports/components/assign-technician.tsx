"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { CreateInterventionRequestPayload, Technician } from "@/lib/types";
import { createInterventionRequest } from "@/app/actions/interventionRequests.action";

type AssignTechnicianProps = {
    reportId: number;
    technicians: Technician[];
};

export function AssignTechnician({ reportId, technicians }: AssignTechnicianProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [selectedTechnicians, setSelectedTechnicians] = useState<number[]>([]);
    const [technicianPopoverOpen, setTechnicianPopoverOpen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setTitle("");
        setSelectedTechnicians([]);
        setDeadline(undefined);
    };

    const handleSubmit = async () => {
        if (!title) {
            toast("Please provide a title for the intervention request");
            return;
        }

        if (!deadline) {
            toast("Please select a deadline", {});
            return;
        }

        if (selectedTechnicians.length === 0) {
            toast("Please select at least one technician");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: CreateInterventionRequestPayload = {
                title,
                reportId,
                deadline: deadline.toISOString().split("T")[0], // This ensures we have a proper ISO string format
                assignedTo: selectedTechnicians.map((techId) => ({
                    technicianId: techId,
                })),
            };

            await createInterventionRequest(payload);

            toast("Technician assigned successfully");
            resetForm();
            setOpen(false);
        } catch (error) {
            toast("Failed to assign technician");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button>Assign Technician</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Technician</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter intervention title"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Deadline</Label>
                        <div className="relative">
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !deadline && "text-muted-foreground"
                                )}
                                onClick={() => setShowCalendar(!showCalendar)}
                                type="button"
                            >
                                {deadline ? format(deadline, "PPP", { locale: fr }) : "Select deadline"}
                                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                            </Button>

                            {showCalendar && (
                                <div className="absolute z-50 mt-1 bg-white p-2 border rounded-md shadow-md">
                                    <Calendar
                                        mode="single"
                                        selected={deadline}
                                        onSelect={(date) => {
                                            setDeadline(date);
                                            setShowCalendar(false);
                                        }}
                                        initialFocus
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Technicians</Label>
                        <Popover open={technicianPopoverOpen} onOpenChange={setTechnicianPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {selectedTechnicians.length > 0
                                        ? `${selectedTechnicians.length} technician(s) selected`
                                        : "Select technicians"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search technicians..." />
                                    <CommandEmpty>No technician found.</CommandEmpty>
                                    <CommandGroup className="max-h-[200px] overflow-auto">
                                        {technicians.map((technician) => (
                                            <CommandItem
                                                key={technician.technicianData.userId}
                                                value={technician.name || "Unknown"}
                                                onSelect={() => {
                                                    setSelectedTechnicians((current) => {
                                                        const userId = technician.technicianData.userId;
                                                        if (current.includes(userId)) {
                                                            return current.filter((id) => id !== userId);
                                                        } else {
                                                            return [...current, userId];
                                                        }
                                                    });
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedTechnicians.includes(technician.technicianData.userId)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {technician.name || "Unknown"}
                                                {technician.technicianData.profession && (
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        ({technician.technicianData.profession.name})
                                                    </span>
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
