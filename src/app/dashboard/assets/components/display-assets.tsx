"use client";
import { createAsset, deleteAsset, updateAsset } from "@/app/actions/assets.action";
import { Button } from "@/components/ui/button";
import { Asset, AssetStatus, AssetType, Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AssetCreateDialog } from "./asset-create-dialog";
import { AssetDeleteDialog } from "./asset-delete-dialog";
import { AssetEditDialog } from "./asset-edit-dialog";
import { AssetFilters } from "./asset-filters";
import { AssetTable } from "./asset-table";

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

    // Dialog form states
    const [createFormType, setCreateFormType] = useState<AssetType | null>(null);
    const [editFormType, setEditFormType] = useState<AssetType | null>(null);

    // Filtered assets based on filter criteria
    const filteredAssets = assets.filter((asset) => {
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

    // Create asset form submission
    async function onCreateSubmit(formData: FormData) {
        const result = await createAsset(formData);

        if (result.success) {
            toast.success("Asset created", {
                description: result.message,
            });
            setIsCreateOpen(false);
            setCreateFormType(null);
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
            setEditFormType(null);
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

    // Handler functions
    const handleEdit = (asset: Asset) => {
        setSelectedAsset(asset);
        setEditFormType(asset.type);
        setIsEditOpen(true);
    };

    const handleDelete = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsDeleteOpen(true);
    };

    const resetFilters = () => {
        setSelectedType(null);
        setSearchQuery("");
        setStatusFilter("ALL");
        setCategoryFilter("ALL");
        setLocationFilter("ALL");
    };

    const handleCreateDialogChange = (open: boolean) => {
        setIsCreateOpen(open);
        if (!open) {
            setCreateFormType(null);
        }
    };

    const handleEditDialogChange = (open: boolean) => {
        setIsEditOpen(open);
        if (!open) {
            setEditFormType(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Assets</h2>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCreateOpen(true)}>
                    Create Asset
                </Button>
            </div>

            <AssetFilters
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                resetFilters={resetFilters}
                filteredAssets={filteredAssets}
                locations={locations}
                categories={categories}
            />

            <AssetTable assets={filteredAssets} onEdit={handleEdit} onDelete={handleDelete} />

            <AssetCreateDialog
                isOpen={isCreateOpen}
                onOpenChange={handleCreateDialogChange}
                onSubmit={onCreateSubmit}
                formType={createFormType}
                setFormType={setCreateFormType}
                locations={locations}
                categories={categories}
            />

            {selectedAsset && (
                <>
                    <AssetEditDialog
                        isOpen={isEditOpen}
                        onOpenChange={handleEditDialogChange}
                        onSubmit={onUpdateSubmit}
                        asset={selectedAsset}
                        formType={editFormType}
                        setFormType={setEditFormType}
                        locations={locations}
                        categories={categories}
                    />

                    <AssetDeleteDialog
                        isOpen={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onConfirm={onDeleteConfirm}
                        asset={selectedAsset}
                    />
                </>
            )}
        </div>
    );
}
