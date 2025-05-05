"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Asset } from "@/lib/types";
import { Edit, Image as ImageIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type AssetTableProps = {
    assets: Asset[];
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
};

export function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

    // Function to check if an image URL is valid
    const isValidImageURL = (url: string | null | undefined): boolean => {
        return !!url && url.trim() !== "";
    };

    // Handle image loading error
    const handleImageError = (assetId: number) => {
        setFailedImages((prev) => ({
            ...prev,
            [assetId]: true,
        }));
    };

    // Display fallback or image
    const renderAssetImage = (asset: Asset) => {
        // Show fallback if:
        // 1. The image URL is empty/invalid
        // 2. The image failed to load previously
        if (!isValidImageURL(asset.image) || failedImages[asset.id]) {
            return (
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
            );
        }

        // Otherwise show the image with error handling
        return (
            <div
                className="cursor-pointer h-10 w-10 rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                onClick={() => setSelectedImage(asset.image)}
            >
                <Image
                    width={40}
                    height={40}
                    src={asset.image!}
                    alt={asset.name}
                    className="h-full w-full object-cover"
                    onError={() => handleImageError(asset.id)}
                />
            </div>
        );
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Image</TableHead>
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
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No assets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            assets.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell>{renderAssetImage(asset)}</TableCell>
                                    <TableCell className="font-medium">{asset.name}</TableCell>
                                    <TableCell>{asset.type}</TableCell>
                                    <TableCell>{asset.inventoryCode}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={asset.status === "OPERATIONAL" ? "default" : "outline"}
                                            className={
                                                asset.status === "OPERATIONAL"
                                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                            }
                                        >
                                            {asset.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{asset.category?.name || "-"}</TableCell>
                                    <TableCell>{asset.location?.name || "-"}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onEdit(asset)}
                                            className="hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-500 hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() => onDelete(asset)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Image preview dialog */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Image Preview</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center p-4">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="Asset preview"
                                className="max-h-[70vh] object-contain"
                                onError={() => setSelectedImage(null)}
                            />
                        ) : (
                            <div className="h-64 w-64 rounded-md bg-muted flex items-center justify-center">
                                <ImageIcon className="h-16 w-16 text-muted-foreground" />
                                <p className="text-muted-foreground mt-4">Image not available</p>
                            </div>
                        )}
                    </div>
                    <DialogClose asChild>
                        <Button className="mt-4">Close</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
}
