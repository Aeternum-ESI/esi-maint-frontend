"use client";

import { CreatePreventiveTaskData } from "@/app/actions/tasks.action";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Asset, Category, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type PlanificationFormProps = {
    selectedDate: Date | null;
    onSubmit: (data: CreatePreventiveTaskData) => Promise<{ success: boolean; message: string }>;
    assets: Asset[];
    categories: Category[];
};

export function PlanificationForm({ selectedDate, onSubmit, assets, categories }: PlanificationFormProps) {
    const [isAssetSelected, setIsAssetSelected] = useState<boolean>(true);
    const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [period, setPeriod] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [priority, setPriority] = useState<Priority>(Priority.LOW);

    const [assetPopoverOpen, setAssetPopoverOpen] = useState(false);
    const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

    // Periods options
    const periodOptions = [
        { value: "1", label: "Every day" }, // 1 day
        { value: "7", label: "Every week" }, // 7 days
        { value: "14", label: "Every 2 weeks" }, // 14 days
        { value: "30", label: "Every month" }, // 30 days
        { value: "90", label: "Every quarter" }, // 90 days
        { value: "180", label: "Every semester" }, // 180 days
        { value: "365", label: "Every year" }, // 365 days
    ];

    // Flatten categories for easier selection
    const flattenedCategories = useMemo(() => {
        const result: Category[] = [];

        const flatten = (cats: Category[] = []) => {
            for (const cat of cats) {
                result.push(cat);
                if (cat.children?.length) {
                    flatten(cat.children);
                }
            }
        };

        flatten(categories);
        return result;
    }, [categories]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate) {
            toast.error("Please select a start date");
            return;
        }

        if (isAssetSelected && !selectedAssetId) {
            toast.error("Please select an asset");
            return;
        }

        if (!isAssetSelected && !selectedCategoryId) {
            toast.error("Please select a category");
            return;
        }

        if (!period) {
            toast.error("Please select a period");
            return;
        }

        if (!description.trim()) {
            toast.error("Please add a description");
            return;
        }

        setIsSubmitting(true);

        try {
            const toLocalDate = (date: Date) =>
                date
                    .toLocaleDateString("fr-CA") // gives YYYY-MM-DD with dashes
                    .replace(/\//g, "-");

            const data: CreatePreventiveTaskData = {
                lastMaintenanceDate: toLocalDate(selectedDate),
                frequency: parseInt(period),
                description: description,
                priority: priority,
                assetId: isAssetSelected ? selectedAssetId : null,

                categoryId: !isAssetSelected ? selectedCategoryId : null,
                // Note: assetId and categoryId are mutually exclusive, only one should be set
            };

            const result = await onSubmit(data);

            if (result.success) {
                toast.success(result.message);
                // Reset form
                setSelectedAssetId(null);
                setSelectedCategoryId(null);
                setPeriod("");
                setDescription("");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred during planning");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle between asset or category */}
            <div className="flex items-center space-x-4 py-2">
                <Button
                    type="button"
                    variant={isAssetSelected ? "default" : "outline"}
                    onClick={() => setIsAssetSelected(true)}
                    className="flex-1"
                >
                    Specific asset
                </Button>
                <Button
                    type="button"
                    variant={!isAssetSelected ? "default" : "outline"}
                    onClick={() => setIsAssetSelected(false)}
                    className="flex-1"
                >
                    Asset category
                </Button>
            </div>

            {/* Asset Selector with Command */}
            {isAssetSelected && (
                <div className="grid gap-2">
                    <Label htmlFor="asset">Asset</Label>
                    <Popover open={assetPopoverOpen} onOpenChange={setAssetPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={assetPopoverOpen}
                                className="justify-between w-full"
                            >
                                {selectedAssetId
                                    ? assets.find((asset) => asset.id === selectedAssetId)?.name
                                    : "Select an asset"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search for an asset..." />
                                <CommandEmpty>No asset found.</CommandEmpty>
                                <CommandGroup>
                                    {assets.map((asset) => (
                                        <CommandItem
                                            key={asset.id}
                                            value={asset.name}
                                            onSelect={() => {
                                                setSelectedAssetId(asset.id === selectedAssetId ? null : asset.id);
                                                setAssetPopoverOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedAssetId === asset.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {asset.name} ({asset.type})
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            {/* Category Selector with Command */}
            {!isAssetSelected && (
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={categoryPopoverOpen}
                                className="justify-between w-full"
                            >
                                {selectedCategoryId
                                    ? flattenedCategories.find((category) => category.id === selectedCategoryId)?.name
                                    : "Select a category"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto">
                            <Command>
                                <CommandInput placeholder="Search for a category..." />
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                    {flattenedCategories.map((category) => (
                                        <CommandItem
                                            key={category.id}
                                            value={category.name}
                                            onSelect={() => {
                                                setSelectedCategoryId(
                                                    category.id === selectedCategoryId ? null : category.id
                                                );
                                                setCategoryPopoverOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCategoryId === category.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {category.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            {/* Period Selector */}
            <div className="grid gap-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a period" />
                    </SelectTrigger>
                    <SelectContent>
                        {periodOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Description */}
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Detailed description of the preventive task..."
                    value={description}
                    className="min-h-32"
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                />
            </div>

            {/* Priority Selector */}
            <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a priority">
                            {priority && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-full",
                                            priority === Priority.LOW && "bg-green-500",
                                            priority === Priority.MEDIUM && "bg-amber-500",
                                            priority === Priority.HIGH && "bg-red-500"
                                        )}
                                    />
                                    <span>{priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}</span>
                                </div>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(Priority).map((p) => (
                            <SelectItem key={p} value={p}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-full",
                                            p === Priority.LOW && "bg-green-500",
                                            p === Priority.MEDIUM && "bg-amber-500",
                                            p === Priority.HIGH && "bg-red-500"
                                        )}
                                    />
                                    <span>{p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !selectedDate}>
                    {isSubmitting ? "Planning in progress..." : "Plan"}
                </Button>
            </div>
        </form>
    );
}
