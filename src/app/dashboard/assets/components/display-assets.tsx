"use client";
import { createAsset, deleteAsset, updateAsset } from "@/app/actions/assets.action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Asset, AssetStatus, AssetType, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, FolderTree, MapPin, Pencil, Search, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export function DisplayAssets({
    assets,
    locations,
    categories,
}: {
    assets: Asset[];
    locations: Asset[];
    categories?: Category[];
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const router = useRouter();

    // Filter states
    const [selectedType, setSelectedType] = useState<AssetType | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<AssetStatus | "ALL">("ALL");
    const [categoryFilter, setCategoryFilter] = useState<number | "ALL">("ALL");
    const [locationFilter, setLocationFilter] = useState<number | "ALL">("ALL");

    // Dialog form states (separate from filter states)
    const [createFormType, setCreateFormType] = useState<AssetType | null>(null);
    const [editFormType, setEditFormType] = useState<AssetType | null>(null);

    // Open/closed states for popover dropdowns
    const [typePopoverOpen, setTypePopoverOpen] = useState(false);
    const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
    const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
    const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

    // Filter locations based on selected asset type
    const getFilteredLocations = useCallback(
        (assetType: AssetType | null) => {
            if (!assetType) return [];

            switch (assetType) {
                case AssetType.EQUIPMENT:
                    // Equipment can be in buildings or rooms
                    return locations.filter((loc) => loc.type === AssetType.BUILDING || loc.type === AssetType.ROOM);
                case AssetType.ROOM:
                    // Rooms must be in buildings
                    return locations.filter((loc) => loc.type === AssetType.BUILDING);
                case AssetType.BUILDING:
                    // Buildings can't have a location
                    return [];
                default:
                    return locations;
            }
        },
        [locations]
    );

    // Filter assets based on search and filters
    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            // Filter by type
            if (selectedType && asset.type !== selectedType) {
                return false;
            }

            // Filter by status
            if (statusFilter !== "ALL" && asset.status !== statusFilter) {
                return false;
            }

            // Filter by category
            if (categoryFilter !== "ALL" && asset.categoryId !== categoryFilter) {
                return false;
            }

            // Filter by location
            if (locationFilter !== "ALL" && asset.locationId !== locationFilter) {
                return false;
            }

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return asset.name.toLowerCase().includes(query) || asset.inventoryCode.toLowerCase().includes(query);
            }

            return true;
        });
    }, [assets, selectedType, statusFilter, categoryFilter, locationFilter, searchQuery]);

    // Create asset form submission
    async function onCreateSubmit(formData: FormData) {
        const result = await createAsset(formData);

        if (result.success) {
            toast.success("Asset created", {
                description: result.message,
            });
            setIsCreateOpen(false);
            setCreateFormType(null); // Reset form state
            router.refresh();
        } else {
            toast.error("Error", {
                description: result.message,
            });
        }
    }

    // Update asset form submission
    async function onUpdateSubmit(formData: FormData) {
        if (!selectedAsset) return;

        const result = await updateAsset(selectedAsset.id, formData);

        if (result.success) {
            toast.success("Asset updated", {
                description: result.message,
            });
            setIsEditOpen(false);
            setEditFormType(null); // Reset form state
            router.refresh();
        } else {
            toast.error("Error", {
                description: result.message,
            });
        }
    }

    // Delete asset
    async function onDeleteConfirm() {
        if (!selectedAsset) return;

        const result = await deleteAsset(selectedAsset.id);

        if (result.success) {
            toast.success("Asset deleted", {
                description: result.message,
            });
            setIsDeleteOpen(false);
            router.refresh();
        } else {
            toast.error("Error", {
                description: result.message,
            });
        }
    }

    // Open edit dialog and set selected asset
    const handleEdit = (asset: Asset) => {
        setSelectedAsset(asset);
        setEditFormType(asset.type);
        setIsEditOpen(true);
    };

    // Open delete dialog and set selected asset
    const handleDelete = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsDeleteOpen(true);
    };

    // Reset filters
    const resetFilters = () => {
        setSelectedType(null);
        setSearchQuery("");
        setStatusFilter("ALL");
        setCategoryFilter("ALL");
        setLocationFilter("ALL");
    };

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

    // Function to handle dialog open/close and reset form states
    const handleCreateDialogChange = (open: boolean) => {
        setIsCreateOpen(open);
        if (!open) {
            setCreateFormType(null); // Reset form type when dialog closes
        }
    };

    const handleEditDialogChange = (open: boolean) => {
        setIsEditOpen(open);
        if (!open) {
            setEditFormType(null); // Reset form type when dialog closes
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Assets</h2>
                <Dialog open={isCreateOpen} onOpenChange={handleCreateDialogChange}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">Create Asset</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Asset</DialogTitle>
                        </DialogHeader>
                        <form action={onCreateSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="inventoryCode">Inventory Code</Label>
                                <Input id="inventoryCode" name="inventoryCode" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    name="type"
                                    required
                                    onValueChange={(value) => setCreateFormType(value as AssetType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={AssetType.BUILDING}>Building</SelectItem>
                                        <SelectItem value={AssetType.ROOM}>Room</SelectItem>
                                        <SelectItem value={AssetType.EQUIPMENT}>Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location selector - only show if not building */}
                            {createFormType !== AssetType.BUILDING && createFormType !== null && (
                                <div className="grid gap-2">
                                    <Label htmlFor="locationId">Location</Label>
                                    <Select name="locationId">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getFilteredLocations(createFormType).map((location) => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {location.name} ({location.type})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {/* Category selector */}
                            {categories && categories.length > 0 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-categoryId">Category</Label>
                                    <Select name="categoryId" defaultValue={""}>
                                        <SelectTrigger className="w-42">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px] overflow-auto">
                                            {flattenedCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Button type="submit" className="w-full">
                                Create Asset
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
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
                                                                categoryFilter === category.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
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

            {/* Assets Table */}
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Inventory Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAssets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No assets found matching your criteria
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredAssets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.type}</TableCell>
                                <TableCell>{asset.inventoryCode}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={asset.status === AssetStatus.OPERATIONAL ? "default" : "destructive"}
                                    >
                                        {asset.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{asset.category?.name || "None"}</TableCell>
                                <TableCell>{asset.location?.name || "None"}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(asset)}
                                        className="hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDelete(asset)}
                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Edit Asset Dialog */}
            {selectedAsset && (
                <Dialog open={isEditOpen} onOpenChange={handleEditDialogChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Asset</DialogTitle>
                        </DialogHeader>
                        <form action={onUpdateSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input id="edit-name" name="name" defaultValue={selectedAsset.name} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-inventoryCode">Inventory Code</Label>
                                <Input
                                    id="edit-inventoryCode"
                                    name="inventoryCode"
                                    defaultValue={selectedAsset.inventoryCode}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-type">Type</Label>
                                <Select
                                    name="type"
                                    required
                                    onValueChange={(value) => setEditFormType(value as AssetType)}
                                    defaultValue={selectedAsset.type}
                                >
                                    <SelectTrigger className="w-42">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={AssetType.BUILDING}>Building</SelectItem>
                                        <SelectItem value={AssetType.ROOM}>Room</SelectItem>
                                        <SelectItem value={AssetType.EQUIPMENT}>Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location selector - only show if not building */}
                            {editFormType !== AssetType.BUILDING && (
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-locationId">Location</Label>
                                    <Select name="locationId" defaultValue={selectedAsset.locationId?.toString() || ""}>
                                        <SelectTrigger className="w-42">
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getFilteredLocations(editFormType).map((location) => (
                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                    {location.name} ({location.type})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Category selector */}
                            {categories && categories.length > 0 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-categoryId">Category</Label>
                                    <Select name="categoryId" defaultValue={selectedAsset.categoryId?.toString() || ""}>
                                        <SelectTrigger className="w-42">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px] overflow-auto">
                                            {flattenedCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Status display - read only, will be changed through different workflow */}
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Current Status</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border border-input bg-background">
                                    <Badge
                                        variant={
                                            selectedAsset.status === AssetStatus.OPERATIONAL ? "default" : "destructive"
                                        }
                                    >
                                        {selectedAsset.status}
                                    </Badge>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (Status changes are managed separately)
                                    </span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                Update Asset
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedAsset?.name}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
