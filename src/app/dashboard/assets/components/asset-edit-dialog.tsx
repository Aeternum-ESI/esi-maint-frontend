"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset, AssetStatus, AssetType, Category } from "@/lib/types";
import { useCallback, useMemo } from "react";

type AssetEditDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: FormData) => Promise<void>;
    asset: Asset;
    formType: AssetType | null;
    setFormType: (type: AssetType | null) => void;
    locations: Asset[];
    categories?: Category[];
};

export function AssetEditDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    asset,
    formType,
    setFormType,
    locations,
    categories,
}: AssetEditDialogProps) {
    // Filter locations based on selected asset type
    const getFilteredLocations = useCallback(
        (assetType: AssetType | null) => {
            if (!assetType) return [];

            switch (assetType) {
                case AssetType.EQUIPMENT:
                    // Equipment can be in sites or zones
                    return locations.filter((loc) => loc.type === AssetType.SITE || loc.type === AssetType.ZONE);
                case AssetType.ZONE:
                    // Zones must be in sites
                    return locations.filter((loc) => loc.type === AssetType.SITE);
                case AssetType.SITE:
                    // Sites can't have a location
                    return [];
                default:
                    return locations;
            }
        },
        [locations]
    );

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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Asset</DialogTitle>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input id="edit-name" name="name" defaultValue={asset.name} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-inventoryCode">Inventory Code</Label>
                        <Input
                            id="edit-inventoryCode"
                            name="inventoryCode"
                            defaultValue={asset.inventoryCode}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-type">Type</Label>
                        <Select
                            name="type"
                            required
                            onValueChange={(value) => setFormType(value as AssetType)}
                            defaultValue={asset.type}
                        >
                            <SelectTrigger className="w-42">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={AssetType.SITE}>Site</SelectItem>
                                <SelectItem value={AssetType.ZONE}>Zone</SelectItem>
                                <SelectItem value={AssetType.EQUIPMENT}>Equipment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Location selector - only show if not site */}
                    {formType !== AssetType.SITE && (
                        <div className="grid gap-2">
                            <Label htmlFor="edit-locationId">Location</Label>
                            <Select name="locationId" defaultValue={asset.locationId?.toString() || ""}>
                                <SelectTrigger className="w-42">
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getFilteredLocations(formType).map((location) => (
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
                            <Select name="categoryId" defaultValue={asset.categoryId?.toString() || ""}>
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
                            <Badge variant={asset.status === AssetStatus.OPERATIONAL ? "default" : "destructive"}>
                                {asset.status}
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
    );
}
