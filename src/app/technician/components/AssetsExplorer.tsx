"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Asset, AssetStatus, AssetType, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
    Building,
    Building2,
    Check,
    CheckCircle,
    ChevronRight,
    ChevronsUpDown,
    CircleAlert,
    Info,
    Laptop,
    MapPin,
    Search,
    Tag,
    Wrench,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

export function AssetsExplorer({ assets, categories }: { assets: Asset[]; categories: Category[] }) {
    // State management
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<AssetType | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<AssetStatus | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activeView, setActiveView] = useState<"grid" | "table">("grid");
    const [typeFilterOpen, setTypeFilterOpen] = useState(false);
    const [statusFilterOpen, setStatusFilterOpen] = useState(false);

    // Memoized data filtering
    const sites = useMemo(() => assets.filter((asset) => asset.type === AssetType.SITE), [assets]);

    const zones = useMemo(() => {
        if (!selectedLocation) return [];
        return assets.filter((asset) => asset.type === AssetType.ZONE && asset.locationId === selectedLocation);
    }, [assets, selectedLocation]);

    const equipment = useMemo(() => {
        if (!selectedLocation) return [];
        return assets.filter((asset) => asset.type === AssetType.EQUIPMENT && asset.locationId === selectedLocation);
    }, [assets, selectedLocation]);

    // Filter assets based on all criteria
    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            // Apply all filters
            const matchesSearch =
                !searchQuery ||
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.inventoryCode.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = !selectedType || asset.type === selectedType;
            const matchesStatus = !selectedStatus || asset.status === selectedStatus;
            const matchesCategory = !selectedCategory || asset.categoryId === selectedCategory;
            const matchesLocation =
                !selectedLocation || asset.locationId === selectedLocation || asset.id === selectedLocation;

            return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesLocation;
        });
    }, [assets, searchQuery, selectedType, selectedStatus, selectedCategory, selectedLocation]);

    // Event handlers
    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
        setSelectedCategory(null);
        setSelectedType(null);
        setSelectedStatus(null);
    }, []);

    const handleAssetSelect = useCallback((asset: Asset) => {
        setSelectedAsset(asset);
        setIsDetailsOpen(true);
    }, []);

    const handleLocationSelect = useCallback((locationId: number | null) => {
        setSelectedLocation(locationId);
    }, []);

    // Helper functions
    const getAssetTypeIcon = (type: AssetType) => {
        switch (type) {
            case AssetType.SITE:
                return <Building className="h-4 w-4" />;
            case AssetType.ZONE:
                return <Building2 className="h-4 w-4" />;
            case AssetType.EQUIPMENT:
                return <Laptop className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    // Generate breadcrumbs for navigation
    const breadcrumbs = useMemo(() => {
        const result = [{ id: null, name: "All Assets", onClick: () => handleLocationSelect(null) }];

        if (!selectedLocation) return result;

        const location = assets.find((a) => a.id === selectedLocation);
        if (!location) return result;

        // Build location hierarchy
        const locationChain = [];
        let currentLocation = location;
        locationChain.unshift({
            id: currentLocation.id,
            name: currentLocation.name,
            onClick: () => {}, // Current location is not clickable
        });

        // Add parent locations if they exist
        let parentId = currentLocation.locationId;
        while (parentId) {
            const parent = assets.find((a) => a.id === parentId);
            if (!parent) break;

            locationChain.unshift({
                id: parent.id,
                name: parent.name,
                onClick: () => handleLocationSelect(parent.id),
            });
            parentId = parent.locationId;
        }

        return [...result, ...locationChain];
    }, [assets, selectedLocation, handleLocationSelect]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold mb-2">Assets Explorer</h1>
                <p className="text-muted-foreground">
                    Browse and explore all assets in the system. Click on any asset to see more details.
                </p>
            </div>

            {/* Filters Card */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search assets by name or code..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Controls */}
                        <div className="flex gap-2">
                            {/* Type Filter */}
                            <Popover open={typeFilterOpen} onOpenChange={setTypeFilterOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-10 gap-1">
                                        <Tag className="h-4 w-4" />
                                        <span>Type</span>
                                        {selectedType && (
                                            <span className="ml-1 rounded-md bg-muted px-1.5 text-xs font-medium">
                                                1
                                            </span>
                                        )}
                                        <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search types..." />
                                        <CommandList>
                                            <CommandEmpty>No type found</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setSelectedType(null);
                                                        setTypeFilterOpen(false);
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
                                                        onSelect={() => {
                                                            setSelectedType(selectedType === type ? null : type);
                                                            setTypeFilterOpen(false);
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
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Status Filter */}
                            <Popover open={statusFilterOpen} onOpenChange={setStatusFilterOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-10 gap-1">
                                        <CircleAlert className="h-4 w-4" />
                                        <span>Status</span>
                                        {selectedStatus && (
                                            <span className="ml-1 rounded-md bg-muted px-1.5 text-xs font-medium">
                                                1
                                            </span>
                                        )}
                                        <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search statuses..." />
                                        <CommandList>
                                            <CommandEmpty>No status found</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setSelectedStatus(null);
                                                        setStatusFilterOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            !selectedStatus ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    All Statuses
                                                </CommandItem>
                                                {Object.values(AssetStatus).map((status) => (
                                                    <CommandItem
                                                        key={status}
                                                        onSelect={() => {
                                                            setSelectedStatus(
                                                                selectedStatus === status ? null : status
                                                            );
                                                            setStatusFilterOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedStatus === status ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {status}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* View Toggle */}
                            <div className="flex border rounded-md overflow-hidden">
                                <Button
                                    variant={activeView === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-none h-10"
                                    onClick={() => setActiveView("grid")}
                                >
                                    Grid
                                </Button>
                                <Separator orientation="vertical" className="h-10" />
                                <Button
                                    variant={activeView === "table" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-none h-10"
                                    onClick={() => setActiveView("table")}
                                >
                                    Table
                                </Button>
                            </div>

                            <Button variant="outline" size="sm" className="h-10" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </div>

                    {/* Breadcrumbs Navigation */}
                    <div className="flex items-center space-x-2 text-sm overflow-x-auto">
                        {breadcrumbs.map((crumb, idx) => (
                            <div key={idx} className="flex items-center whitespace-nowrap">
                                {idx > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
                                <Button
                                    variant="link"
                                    className={cn(
                                        "h-auto p-0",
                                        idx === breadcrumbs.length - 1
                                            ? "text-primary font-medium pointer-events-none"
                                            : "text-muted-foreground"
                                    )}
                                    onClick={crumb.onClick}
                                    disabled={idx === breadcrumbs.length - 1}
                                >
                                    {crumb.name}
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left Sidebar - Categories */}
                <Card className="md:col-span-3">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Navigation</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ScrollArea className="h-[60vh] pr-4">
                            <Accordion type="multiple" defaultValue={["categories", "locations"]}>
                                <AccordionItem value="categories">
                                    <AccordionTrigger className="text-sm">Asset Categories</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-1">
                                            <Button
                                                variant={selectedCategory === null ? "secondary" : "ghost"}
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => setSelectedCategory(null)}
                                            >
                                                All Categories
                                            </Button>
                                            {categories.map((category) => (
                                                <CategoryItem
                                                    key={category.id}
                                                    category={category}
                                                    selectedCategory={selectedCategory}
                                                    onSelect={setSelectedCategory}
                                                    level={0}
                                                />
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="locations">
                                    <AccordionTrigger className="text-sm">Locations</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-1">
                                            <Button
                                                variant={selectedLocation === null ? "secondary" : "ghost"}
                                                size="sm"
                                                className="w-full justify-start"
                                                onClick={() => setSelectedLocation(null)}
                                            >
                                                All Locations
                                            </Button>
                                            {sites.map((site) => (
                                                <Button
                                                    key={site.id}
                                                    variant={selectedLocation === site.id ? "secondary" : "ghost"}
                                                    size="sm"
                                                    className="w-full justify-start pl-4"
                                                    onClick={() => setSelectedLocation(site.id)}
                                                >
                                                    <Building className="h-4 w-4 mr-2" />
                                                    {site.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Right Content Area */}
                <div className="md:col-span-9">
                    <Tabs defaultValue="assets">
                        <TabsList>
                            <TabsTrigger value="assets">Assets ({filteredAssets.length})</TabsTrigger>
                            {selectedLocation && <TabsTrigger value="children">Children</TabsTrigger>}
                        </TabsList>

                        {/* Assets Tab */}
                        <TabsContent value="assets" className="mt-4">
                            {filteredAssets.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center h-[40vh]">
                                        <Info className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-lg font-medium">No assets found</p>
                                        <p className="text-muted-foreground">
                                            Try adjusting your filters or search query
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : activeView === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredAssets.map((asset) => (
                                        <AssetCard
                                            key={asset.id}
                                            asset={asset}
                                            onSelect={handleAssetSelect}
                                            getAssetTypeIcon={getAssetTypeIcon}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <AssetTable
                                    assets={filteredAssets}
                                    onSelect={handleAssetSelect}
                                    getAssetTypeIcon={getAssetTypeIcon}
                                />
                            )}
                        </TabsContent>

                        {/* Children Tab */}
                        {selectedLocation && (
                            <TabsContent value="children" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Zones Section */}
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Zones ({zones.length})</CardTitle>
                                            <CardDescription>Zones in this location</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <ScrollArea className="h-[300px]">
                                                {zones.length === 0 ? (
                                                    <div className="text-center py-8 text-muted-foreground">
                                                        No zones in this location
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {zones.map((zone) => (
                                                            <div
                                                                key={zone.id}
                                                                className="p-2 rounded-md border hover:bg-muted cursor-pointer"
                                                                onClick={() => setSelectedLocation(zone.id)}
                                                            >
                                                                <div className="font-medium">{zone.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {zone.inventoryCode}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>

                                    {/* Equipment Section */}
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Equipment ({equipment.length})</CardTitle>
                                            <CardDescription>Equipment in this location</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <ScrollArea className="h-[300px]">
                                                {equipment.length === 0 ? (
                                                    <div className="text-center py-8 text-muted-foreground">
                                                        No equipment in this location
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {equipment.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="p-2 rounded-md border hover:bg-muted cursor-pointer"
                                                                onClick={() => handleAssetSelect(item)}
                                                            >
                                                                <div className="flex justify-between">
                                                                    <span className="font-medium">{item.name}</span>
                                                                    <Badge
                                                                        variant={
                                                                            item.status === AssetStatus.OPERATIONAL
                                                                                ? "outline"
                                                                                : "destructive"
                                                                        }
                                                                    >
                                                                        {item.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {item.inventoryCode}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>

            {/* Asset Details Dialog */}
            <AssetDetailsDialog
                asset={selectedAsset}
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                zones={zones}
                equipment={equipment}
                getAssetTypeIcon={getAssetTypeIcon}
                onLocationSelect={setSelectedLocation}
            />
        </div>
    );
}

// Helper Components
function AssetCard({
    asset,
    onSelect,
    getAssetTypeIcon,
}: {
    asset: Asset;
    onSelect: (asset: Asset) => void;
    getAssetTypeIcon: (type: AssetType) => React.JSX.Element;
}) {
    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(asset)}>
            <CardHeader className="pb-2">
                <div className="flex justify-between">
                    <Badge
                        variant={
                            asset.type === AssetType.SITE
                                ? "outline"
                                : asset.type === AssetType.ZONE
                                ? "secondary"
                                : "default"
                        }
                    >
                        {getAssetTypeIcon(asset.type)}
                        <span className="ml-1">{asset.type}</span>
                    </Badge>
                    <Badge variant={asset.status === AssetStatus.OPERATIONAL ? "default" : "destructive"}>
                        {asset.status}
                    </Badge>
                </div>
                <CardTitle className="text-lg truncate">{asset.name}</CardTitle>
                <CardDescription className="truncate">{asset.inventoryCode}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 space-y-1 text-sm">
                {asset.category && (
                    <div className="flex items-center">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                        <span className="truncate">{asset.category.name}</span>
                    </div>
                )}
                {asset.location && (
                    <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                        <span className="truncate">{asset.location.name}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-0">
                <div className="mt-2 pt-2 border-t w-full flex justify-between text-xs text-muted-foreground">
                    <span>Last updated: {new Date(asset.updatedAt).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                        View
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

function AssetTable({
    assets,
    onSelect,
    getAssetTypeIcon,
}: {
    assets: Asset[];
    onSelect: (asset: Asset) => void;
    getAssetTypeIcon: (type: AssetType) => React.JSX.Element;
}) {
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
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
                        {assets.map((asset) => (
                            <TableRow key={asset.id} className="cursor-pointer" onClick={() => onSelect(asset)}>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        {getAssetTypeIcon(asset.type)}
                                        <span className="ml-1">{asset.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{asset.inventoryCode}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={asset.status === AssetStatus.OPERATIONAL ? "outline" : "destructive"}
                                    >
                                        {asset.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{asset.category?.name || "—"}</TableCell>
                                <TableCell>{asset.location?.name || "—"}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function AssetDetailsDialog({
    asset,
    isOpen,
    onOpenChange,
    zones,
    equipment,
    getAssetTypeIcon,
    onLocationSelect,
}: {
    asset: Asset | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    zones: Asset[];
    equipment: Asset[];
    getAssetTypeIcon: (type: AssetType) => React.JSX.Element;
    onLocationSelect: (locationId: number | null) => void;
}) {
    if (!asset) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-8">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{asset.name}</span>
                        <Badge variant={asset.status === AssetStatus.OPERATIONAL ? "outline" : "destructive"}>
                            {asset.status}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>{asset.inventoryCode}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Asset Details */}
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Details</div>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="text-muted-foreground">Type</div>
                                <div className="flex items-center">
                                    {getAssetTypeIcon(asset.type)}
                                    <span className="ml-1">{asset.type}</span>
                                </div>

                                <div className="text-muted-foreground">Category</div>
                                <div>{asset.category?.name || "—"}</div>

                                <div className="text-muted-foreground">Location</div>
                                <div>{asset.location?.name || "—"}</div>

                                <div className="text-muted-foreground">Created</div>
                                <div>{new Date(asset.createdAt).toLocaleDateString()}</div>

                                <div className="text-muted-foreground">Last Updated</div>
                                <div>{new Date(asset.updatedAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="space-y-3">
                            <div className="text-sm font-medium">Status Information</div>
                            <div className="flex items-center space-x-2">
                                {asset.status === AssetStatus.OPERATIONAL ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Wrench className="h-5 w-5 text-amber-500" />
                                )}
                                <span>
                                    {asset.status === AssetStatus.OPERATIONAL
                                        ? "This asset is operational and ready for use."
                                        : "This asset is currently under maintenance."}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Asset Relationships */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Related Assets</div>

                        {asset.type !== AssetType.EQUIPMENT && (
                            <Card className="bg-muted/40">
                                <CardHeader className="p-3 pb-1">
                                    <CardTitle className="text-sm">Contains</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                    {asset.type === AssetType.SITE ? (
                                        <div className="flex items-center justify-between">
                                            <span>{zones.length} zones in this site</span>
                                            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                                                View All
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span>{equipment.length} equipment in this zone</span>
                                            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                                                View All
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {asset.location && (
                            <Card className="bg-muted/40">
                                <CardHeader className="p-3 pb-1">
                                    <CardTitle className="text-sm">Located in</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto"
                                        onClick={() => {
                                            onLocationSelect(asset.location?.id || null);
                                            onOpenChange(false);
                                        }}
                                    >
                                        {asset.location.name}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper component for rendering category tree
function CategoryItem({
    category,
    selectedCategory,
    onSelect,
    level = 0,
}: {
    category: Category;
    selectedCategory: number | null;
    onSelect: (id: number) => void;
    level: number;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="space-y-1">
            <div className="flex items-center">
                {hasChildren && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 mr-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </Button>
                )}
                <Button
                    variant={selectedCategory === category.id ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${hasChildren ? "" : "ml-7"}`}
                    style={{ paddingLeft: `${level * 8 + 8}px` }}
                    onClick={() => onSelect(category.id)}
                >
                    {category.name}
                </Button>
            </div>

            {isExpanded && hasChildren && (
                <div className="ml-4">
                    {category.children.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            selectedCategory={selectedCategory}
                            onSelect={onSelect}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
