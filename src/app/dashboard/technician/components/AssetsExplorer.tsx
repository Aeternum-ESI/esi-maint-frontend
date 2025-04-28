"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, FolderTree, Briefcase, Box, Layers, Filter, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Asset, Category } from "@/lib/types";

export function AssetsExplorer({ assets, categories }: { assets: Asset[], categories: Category[] }) {
    const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");



    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedCategory, selectedType, assets]);



    const applyFilters = () => {
        let filtered = [...assets];

        // Apply search filter
        if (searchTerm.trim() !== "") {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (asset) =>
                    asset.name.toLowerCase().includes(lowercasedTerm) ||
                    asset.inventoryCode.toLowerCase().includes(lowercasedTerm)
            );
        }

        // Apply category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter((asset) => asset.categoryId === parseInt(selectedCategory));
        }

        // Apply type filter
        if (selectedType !== "all") {
            filtered = filtered.filter((asset) => asset.type === selectedType);
        }

        setFilteredAssets(filtered);
    };

    const handleViewDetails = (asset) => {
        setSelectedAsset(asset);
        setShowDetails(true);
    };

    // Function to render the asset type icon
    const renderAssetTypeIcon = (type) => {
        switch (type) {
            case "SITE":
                return <Briefcase className="h-5 w-5" />;
            case "EQUIPMENT":
                return <Box className="h-5 w-5" />;
            case "ZONE":
                return <Layers className="h-5 w-5" />;
            default:
                return <Briefcase className="h-5 w-5" />;
        }
    };

    // Function to render the asset status badge
    const renderStatusBadge = (status) => {
        const statusStyles = {
            OPERATIONAL: "bg-green-100 text-green-800",
            UNDER_MAINTENANCE: "bg-amber-100 text-amber-800",
        };

        return <Badge className={statusStyles[status]}>{status.replace("_", " ")}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <CardTitle>Assets Explorer</CardTitle>
                            <CardDescription>Browse and view all assets in the system</CardDescription>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search assets..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="SITE">Site</SelectItem>
                                        <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                                        <SelectItem value="ZONE">Zone</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredAssets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium">No assets found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAssets.map((asset) => (
                                <Card
                                    key={asset.id}
                                    className="overflow-hidden border border-gray-200 hover:border-primary/50 transition-colors"
                                >
                                    <CardHeader className="pb-2 bg-muted/50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                {renderAssetTypeIcon(asset.type)}
                                                <CardTitle className="text-base">{asset.name}</CardTitle>
                                            </div>
                                            {renderStatusBadge(asset.status)}
                                        </div>
                                        <CardDescription>{asset.inventoryCode}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-3 text-sm">
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Type:</span>
                                                <span>{asset.type}</span>
                                            </div>
                                            {asset.category && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Category:</span>
                                                    <span>{asset.category.name}</span>
                                                </div>
                                            )}
                                            {asset.location && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Location:</span>
                                                    <span>{asset.location.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between"
                                            onClick={() => handleViewDetails(asset)}
                                        >
                                            View Details
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Asset Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Asset Details</DialogTitle>
                    </DialogHeader>
                    {selectedAsset && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        {renderAssetTypeIcon(selectedAsset.type)}
                                        {selectedAsset.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Inventory Code: {selectedAsset.inventoryCode}
                                    </p>
                                </div>
                                {renderStatusBadge(selectedAsset.status)}
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Asset Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="font-medium">ID</span>
                                            <span>#{selectedAsset.id}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="font-medium">Type</span>
                                            <span>{selectedAsset.type}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="font-medium">Status</span>
                                            <span>{selectedAsset.status}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-medium">Created</span>
                                            <span>{new Date(selectedAsset.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Relationships</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {selectedAsset.category ? (
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="font-medium">Category</span>
                                                <span>{selectedAsset.category.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="font-medium">Category</span>
                                                <span className="text-muted-foreground">None</span>
                                            </div>
                                        )}

                                        {selectedAsset.location ? (
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="font-medium">Parent Location</span>
                                                <span>{selectedAsset.location.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="font-medium">Parent Location</span>
                                                <span className="text-muted-foreground">None</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between py-1">
                                            <span className="font-medium">Sub-assets</span>
                                            <span>{selectedAsset.subAssets?.length || 0}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {selectedAsset.subAssets && selectedAsset.subAssets.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center">
                                            <FolderTree className="h-5 w-5 mr-2" /> Sub-assets
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-64">
                                            <div className="space-y-2">
                                                {selectedAsset.subAssets.map((subAsset) => (
                                                    <div
                                                        key={subAsset.id}
                                                        className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 cursor-pointer"
                                                        onClick={() => handleViewDetails(subAsset)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {renderAssetTypeIcon(subAsset.type)}
                                                            <div>
                                                                <div className="font-medium">{subAsset.name}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {subAsset.inventoryCode}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {renderStatusBadge(subAsset.status)}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            )}

                            {selectedAsset.reports && selectedAsset.reports.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Related Reports</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {selectedAsset.reports.slice(0, 5).map((report) => (
                                                <div key={report.id} className="p-2 border rounded-md">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">#{report.id}</span>
                                                        <Badge>{report.status}</Badge>
                                                    </div>
                                                    <p className="text-sm line-clamp-1 mt-1">
                                                        {report.description || "No description"}
                                                    </p>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {new Date(report.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                            {selectedAsset.reports.length > 5 && (
                                                <div className="text-center text-sm text-muted-foreground pt-2">
                                                    + {selectedAsset.reports.length - 5} more reports
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetails(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
