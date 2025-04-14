"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Asset, AssetStatus } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";

type AssetTableProps = {
    assets: Asset[];
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
};

export function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
    return (
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
                {assets.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No assets found matching your criteria
                        </TableCell>
                    </TableRow>
                ) : (
                    assets.map((asset) => (
                        <TableRow key={asset.id}>
                            <TableCell>{asset.name}</TableCell>
                            <TableCell>{asset.type}</TableCell>
                            <TableCell>{asset.inventoryCode}</TableCell>
                            <TableCell>
                                <Badge variant={asset.status === AssetStatus.OPERATIONAL ? "default" : "destructive"}>
                                    {asset.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{asset.category?.name || "None"}</TableCell>
                            <TableCell>{asset.location?.name || "None"}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onEdit(asset)}
                                    className="hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDelete(asset)}
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
    );
}
