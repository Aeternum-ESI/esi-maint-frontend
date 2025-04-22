"use client";

import { useState, useCallback, useMemo } from "react";
import { Asset } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetSearchBarProps {
    assets: Asset[];
    onSelectAsset: (asset: Asset) => void;
}

export default function AssetSearchBar({ assets, onSelectAsset }: AssetSearchBarProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const filteredAssets = useMemo(() => {
        if (!searchValue) return assets;

        const searchLower = searchValue.toLowerCase();
        return assets.filter(
            (asset) =>
                asset.name.toLowerCase().includes(searchLower) ||
                asset.inventoryCode.toLowerCase().includes(searchLower)
        );
    }, [assets, searchValue]);

    const handleSelect = useCallback(
        (asset: Asset) => {
            setSelectedAsset(asset);
            onSelectAsset(asset);
            setOpen(false);
        },
        [onSelectAsset]
    );

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Rechercher un actif par nom ou code d&apos;inventaire</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedAsset
                                ? `${selectedAsset.name} (${selectedAsset.inventoryCode})`
                                : "Rechercher un actif..."}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                            >
                                <path d="m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z" />
                            </svg>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                            <CommandInput
                                placeholder="Rechercher par nom ou code..."
                                value={searchValue}
                                onValueChange={setSearchValue}
                            />
                            <CommandList>
                                <CommandEmpty>Aucun actif trouvé.</CommandEmpty>
                                <CommandGroup>
                                    {filteredAssets.slice(0, 50).map((asset) => (
                                        <CommandItem
                                            key={asset.id}
                                            value={`${asset.name}-${asset.inventoryCode}`}
                                            onSelect={() => handleSelect(asset)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedAsset?.id === asset.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{asset.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {asset.inventoryCode} ({asset.type})
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
