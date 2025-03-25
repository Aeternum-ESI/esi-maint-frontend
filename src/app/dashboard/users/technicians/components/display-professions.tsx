"use client";

import { createProfession, deleteProfession, updateProfession } from "@/app/actions/professions.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Profession } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const DisplayProfessions = ({ professions: initialProfessions }: { professions: Profession[] }) => {
    // Local state for optimistic updates
    const [professions, setProfessions] = useState(initialProfessions);
    const [newProfession, setNewProfession] = useState("");
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [pendingOperations, setPendingOperations] = useState<Record<number, "updating" | "deleting" | null>>({});
    const inputRef = useRef<HTMLInputElement>(null);
    const editContainerRef = useRef<HTMLDivElement>(null);

    // When editing mode is activated, focus the input
    useEffect(() => {
        if (editingId !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    // Handle clicks outside the edit input
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                editingId !== null &&
                editContainerRef.current &&
                !editContainerRef.current.contains(event.target as Node)
            ) {
                cancelEditing();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingId]);

    const startEditing = (profession: { id: number; name: string }) => {
        setEditingId(profession.id);
        setEditValue(profession.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    // Optimistic update for creating a new profession
    const handleCreateProfession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProfession.trim()) return;

        // Generate a temporary ID (negative to avoid conflicts with server IDs)
        const tempId = -Date.now();

        // Add to local state immediately (optimistic update)
        const newItem = { id: tempId, name: newProfession };
        setProfessions((prev) => [...prev, newItem]);

        // Close dialog and reset form
        setOpen(false);
        setNewProfession("");

        try {
            // Actually perform the server operation
            await createProfession(newProfession);
            // Note: We don't need to update state here since the page will revalidate
            // and get fresh data from the server including the real ID
        } catch (error) {
            toast("Erreur dans la création de profession", {
                description: "There was an error creating the profession. Please try again.",
            });
            // If there's an error, remove the optimistic item
            setProfessions((prev) => prev.filter((p) => p.id !== tempId));
        }
    };

    // Optimistic update for editing a profession
    const saveEdit = async (id: number) => {
        if (!editValue.trim() || pendingOperations[id]) return;

        // Store the original value in case we need to revert
        const originalProfession = professions.find((p) => p.id === id);
        if (!originalProfession) return;

        // Update locally first (optimistic) before exiting edit mode or marking as pending
        setProfessions((prev) => prev.map((p) => (p.id === id ? { ...p, name: editValue } : p)));

        // Exit edit mode before marking as pending to ensure UI consistency
        setEditingId(null);

        // Mark this profession as updating (after local update and exiting edit mode)
        setPendingOperations((prev) => ({ ...prev, [id]: "updating" }));

        try {
            // Perform the actual update
            await updateProfession(id, editValue);
            // Clear pending status
            setPendingOperations((prev) => ({ ...prev, [id]: null }));
        } catch (error) {
            // Revert to original on error
            setProfessions((prev) => prev.map((p) => (p.id === id ? originalProfession : p)));
            setPendingOperations((prev) => ({ ...prev, [id]: null }));
            toast("Failed to update profession", {
                description: "There was an error updating the profession. Please try again.",
            });
        }
    };

    // Optimistic update for deleting a profession
    const handleDelete = async (id: number) => {
        if (pendingOperations[id]) return;

        // Store the profession in case we need to restore it
        const professionToDelete = professions.find((p) => p.id === id);
        if (!professionToDelete) return;

        // Mark as deleting
        setPendingOperations((prev) => ({ ...prev, [id]: "deleting" }));

        // Remove from local state immediately
        setProfessions((prev) => prev.filter((p) => p.id !== id));

        try {
            // Perform the actual deletion
            await deleteProfession(id);
            // Clear pending status
            setPendingOperations((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        } catch (error) {
            // Restore on error
            setProfessions((prev) => [...prev, professionToDelete]);
            setPendingOperations((prev) => ({ ...prev, [id]: null }));
            toast("Failed to delete profession", {
                description: "There was an error deleting the profession. Please try again.",
            });
        }
    };

    // Filter professions based on selection
    const filteredProfessions = roleFilter
        ? professions.filter((p) => p.name.toLowerCase().includes(roleFilter.toLowerCase()))
        : professions;

    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Professions</h2>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-2 h-8 gap-1">
                                <Filter className="h-3.5 w-3.5" />
                                <span>Filter</span>
                                {roleFilter && (
                                    <span className="rounded-md bg-muted px-1.5 text-xs font-medium">1</span>
                                )}
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
                </div>
                <Dialog
                    open={open}
                    onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        if (!isOpen) setNewProfession("");
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>Ajouter Profession</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <div className="p-4">
                            <DialogTitle className="text-xl font-bold">Ajouter une Profession</DialogTitle>
                            <form onSubmit={handleCreateProfession}>
                                <div className="mt-4">
                                    <input
                                        value={newProfession}
                                        onChange={(e) => setNewProfession(e.target.value)}
                                        type="text"
                                        placeholder="Profession name"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button type="submit" disabled={!newProfession}>
                                        Add
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfessions.map((profession) => {
                    const isPending = Boolean(pendingOperations[profession.id]);
                    const isDeleting = pendingOperations[profession.id] === "deleting";
                    const isUpdating = pendingOperations[profession.id] === "updating";

                    return (
                        <Card
                            key={profession.id}
                            className={cn(
                                "p-4 transition-opacity duration-200",
                                isDeleting && "opacity-50",
                                isUpdating && "opacity-80"
                            )}
                        >
                            <div className="flex justify-between items-center">
                                {editingId === profession.id ? (
                                    <div ref={editContainerRef} className="flex-1 pr-2">
                                        <input
                                            ref={inputRef}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(profession.id);
                                                if (e.key === "Escape") cancelEditing();
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <span
                                        className={cn(
                                            "text-sm font-medium px-1 cursor-pointer",
                                            isPending && "text-muted-foreground"
                                        )}
                                        onClick={() => !isPending && startEditing(profession)}
                                    >
                                        {profession.name}
                                        {isPending && " ..."}
                                    </span>
                                )}
                                <div className="flex space-x-2">
                                    {editingId === profession.id ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => saveEdit(profession.id)}
                                                disabled={isPending}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={cancelEditing}
                                                disabled={isPending}
                                            >
                                                Discard
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => startEditing(profession)}
                                                disabled={isPending}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(profession.id)}
                                                disabled={isPending}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
