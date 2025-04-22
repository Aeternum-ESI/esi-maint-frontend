"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset, AssetType } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

interface AssetFiltersProps {
    selectedType: AssetType;
    allAssets: Asset[];
    sites: Asset[];
    onSelectAsset: (asset: Asset) => void;
}

export default function AssetFilters({ selectedType, allAssets, sites, onSelectAsset }: AssetFiltersProps) {
    const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
    const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);

    // Reset selections when type changes
    useEffect(() => {
        setSelectedSiteId(null);
        setSelectedZoneId(null);
        setSelectedEquipmentId(null);
    }, [selectedType]);

    // Filter zones based on selected site
    const zones = useMemo(() => {
        if (!selectedSiteId) return [];
        return allAssets.filter((asset) => asset.type === AssetType.ZONE && asset.locationId === selectedSiteId);
    }, [allAssets, selectedSiteId]);

    // Filter equipment based on selected zone
    const equipment = useMemo(() => {
        if (!selectedZoneId) return [];
        return allAssets.filter((asset) => asset.type === AssetType.EQUIPMENT && asset.locationId === selectedZoneId);
    }, [allAssets, selectedZoneId]);

    // Update selected asset when a selection changes
    useEffect(() => {
        if (selectedType === AssetType.SITE && selectedSiteId) {
            const asset = allAssets.find((a) => a.id === selectedSiteId);
            if (asset) onSelectAsset(asset);
        } else if (selectedType === AssetType.ZONE && selectedZoneId) {
            const asset = allAssets.find((a) => a.id === selectedZoneId);
            if (asset) onSelectAsset(asset);
        } else if (selectedType === AssetType.EQUIPMENT && selectedEquipmentId) {
            const asset = allAssets.find((a) => a.id === selectedEquipmentId);
            if (asset) onSelectAsset(asset);
        }
    }, [selectedSiteId, selectedZoneId, selectedEquipmentId, selectedType, allAssets, onSelectAsset]);

    return (
        <div className="space-y-4">
            {/* Site Selection (always shown) */}
            <div>
                <Label htmlFor="site">Site</Label>
                <Select
                    value={selectedSiteId?.toString() || ""}
                    onValueChange={(value) => setSelectedSiteId(Number(value))}
                >
                    <SelectTrigger id="site">
                        <SelectValue placeholder="Sélectionnez un site" />
                    </SelectTrigger>
                    <SelectContent>
                        {sites.map((site) => (
                            <SelectItem key={site.id} value={site.id.toString()}>
                                {site.name} ({site.inventoryCode})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Zone Selection (shown for ZONE and EQUIPMENT) */}
            {(selectedType === AssetType.ZONE || selectedType === AssetType.EQUIPMENT) && (
                <div>
                    <Label htmlFor="zone">Zone</Label>
                    <Select
                        value={selectedZoneId?.toString() || ""}
                        onValueChange={(value) => setSelectedZoneId(Number(value))}
                        disabled={!selectedSiteId}
                    >
                        <SelectTrigger id="zone">
                            <SelectValue
                                placeholder={!selectedSiteId ? "Sélectionnez d'abord un site" : "Sélectionnez une zone"}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {zones.map((zone) => (
                                <SelectItem key={zone.id} value={zone.id.toString()}>
                                    {zone.name} ({zone.inventoryCode})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Equipment Selection (shown only for EQUIPMENT) */}
            {selectedType === AssetType.EQUIPMENT && (
                <div>
                    <Label htmlFor="equipment">Équipement</Label>
                    <Select
                        value={selectedEquipmentId?.toString() || ""}
                        onValueChange={(value) => setSelectedEquipmentId(Number(value))}
                        disabled={!selectedZoneId}
                    >
                        <SelectTrigger id="equipment">
                            <SelectValue
                                placeholder={
                                    !selectedZoneId ? "Sélectionnez d'abord une zone" : "Sélectionnez un équipement"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {equipment.map((eq) => (
                                <SelectItem key={eq.id} value={eq.id.toString()}>
                                    {eq.name} ({eq.inventoryCode})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
