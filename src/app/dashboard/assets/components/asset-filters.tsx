"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Asset, AssetStatus, AssetType, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, FolderTree, MapPin, Search, Tag } from "lucide-react";
import { useMemo, useState } from "react";

type AssetFiltersProps = {
    selectedType: AssetType | null;
    setSelectedType: (type: AssetType | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: AssetStatus | "ALL";
    setStatusFilter: (status: AssetStatus | "ALL") => void;
    categoryFilter: number | "ALL";
    setCategoryFilter: (categoryId: number | "ALL") => void;
    locationFilter: number | "ALL";
    setLocationFilter: (locationId: number | "ALL") => void;
    resetFilters: () => void;
    filteredAssets: Asset[];
    locations: Asset[];
    categories?: Category[];
};

export function AssetFilters({
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter,
    resetFilters,
    filteredAssets,
    locations,
    categories,
}: AssetFiltersProps) {
    // Open/closed states for popover dropdowns
    const [typePopoverOpen, setTypePopoverOpen] = useState(false);
    const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
    const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
    const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

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

    return (
        <Card className="border-border">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 grid gap-2">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search by name or code..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Type Filter with Command */}
                    <div className="flex-1 grid gap-2">
                        <Label htmlFor="type-filter" className="flex items-center gap-1">
                            <Tag size={14} /> Type
                        </Label>
                        <Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={typePopoverOpen}
                                    className="justify-between w-full"
                                >
                                    {selectedType ? selectedType : "All Types"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search type..." />
                                    <CommandEmpty>No type found.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="all"
                                            onSelect={() => {
                                                setSelectedType(null);
                                                setTypePopoverOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    !selectedType ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            All Types
                                        </CommandItem>
                                        {Object.values(AssetType).map((type) => (
                                            <CommandItem
                                                key={type}
                                                value={type}
                                                onSelect={() => {
                                                    setSelectedType(type as AssetType);
                                                    setTypePopoverOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedType === type ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {type}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Status Filter with Command */}
                    <div className="flex-1 grid gap-2">
                        <Label htmlFor="status-filter">Status</Label>
                        <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={statusPopoverOpen}
                                    className="justify-between w-full"
                                >
                                    {statusFilter === "ALL" ? "All Statuses" : statusFilter}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search status..." />
                                    <CommandEmpty>No status found.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="ALL"
                                            onSelect={() => {
                                                setStatusFilter("ALL");
                                                setStatusPopoverOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    statusFilter === "ALL" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            All Statuses
                                        </CommandItem>
                                        {Object.values(AssetStatus).map((status) => (
                                            <CommandItem
                                                key={status}
                                                value={status}
                                                onSelect={() => {
                                                    setStatusFilter(status);
                                                    setStatusPopoverOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        statusFilter === status ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {status}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Additional filters row */}
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                    {categories && categories.length > 0 && (
                        <div className="flex-1 grid gap-2">
                            <Label htmlFor="category-filter" className="flex items-center gap-1">
                                <FolderTree size={14} /> Category
                            </Label>
                            <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={categoryPopoverOpen}
                                        className="justify-between w-full"
                                    >
                                        {categoryFilter === "ALL"
                                            ? "All Categories"
                                            : flattenedCategories.find((c) => c.id === categoryFilter)?.name ||
                                              "All Categories"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto">
                                    <Command>
                                        <CommandInput placeholder="Search categories..." />
                                        <CommandEmpty>No category found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value="ALL"
                                                onSelect={() => {
                                                    setCategoryFilter("ALL");
                                                    setCategoryPopoverOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        categoryFilter === "ALL" ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                All Categories
                                            </CommandItem>
                                            {flattenedCategories.map((category) => (
                                                <CommandItem
                                                    key={category.id}
                                                    value={category.name}
                                                    onSelect={() => {
                                                        setCategoryFilter(category.id);
                                                        setCategoryPopoverOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            categoryFilter === category.id ? "opacity-100" : "opacity-0"
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

                    {/* Location Filter with Command */}
                    <div className="flex-1 grid gap-2">
                        <Label htmlFor="location-filter" className="flex items-center gap-1">
                            <MapPin size={14} /> Location
                        </Label>
                        <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={locationPopoverOpen}
                                    className="justify-between w-full"
                                >
                                    {locationFilter === "ALL"
                                        ? "All Locations"
                                        : locations.find((l) => l.id === locationFilter)?.name || "All Locations"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto">
                                <Command>
                                    <CommandInput placeholder="Search locations..." />
                                    <CommandEmpty>No location found.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="ALL"
                                            onSelect={() => {
                                                setLocationFilter("ALL");
                                                setLocationPopoverOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    locationFilter === "ALL" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            All Locations
                                        </CommandItem>
                                        {locations.map((location) => (
                                            <CommandItem
                                                key={location.id}
                                                value={location.name}
                                                onSelect={() => {
                                                    setLocationFilter(location.id);
                                                    setLocationPopoverOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        locationFilter === location.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {location.name} ({location.type})
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex-1 flex items-end">
                        <Button
                            variant="outline"
                            size="default"
                            onClick={resetFilters}
                            className="w-full border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                    {filteredAssets.length} {filteredAssets.length === 1 ? "asset" : "assets"} found
                </div>
            </CardContent>
        </Card>
    );
}
