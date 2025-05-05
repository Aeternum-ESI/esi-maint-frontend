"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset, AssetType, Category } from "@/lib/types";
import { useCallback, useMemo, useState, useRef } from "react";
import { Camera, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type AssetCreateDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: FormData) => Promise<void>;
    formType: AssetType | null;
    setFormType: (type: AssetType | null) => void;
    locations: Asset[];
    categories?: Category[];
};

export function AssetCreateDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    formType,
    setFormType,
    locations,
    categories,
}: AssetCreateDialogProps) {
    // Add state for image handling
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

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

    // Custom function to handle file upload
    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setIsUploading(true);

        try {
            // Create form data for upload
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "ESIMAINT");

            // Upload to Cloudinary directly
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            );

            const result = await response.json();

            if (result.secure_url) {
                setPreviewImage(result.secure_url);
                toast.success("Image uploaded successfully!");
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            handleFileUpload(event.target.files[0]);
        }
    };

    // Remove uploaded image
    const removeImage = () => {
        setPreviewImage(null);
    };

    // Custom submit handler to include image
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // Add the image URL to form data if available
        if (previewImage) {
            formData.append("image", previewImage);
        }

        await onSubmit(formData);
        setPreviewImage(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-auto p-6">
                <DialogHeader>
                    <DialogTitle>Create New Asset</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Select name="type" required onValueChange={(value) => setFormType(value as AssetType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={AssetType.SITE}>Site</SelectItem>
                                <SelectItem value={AssetType.ZONE}>Zone</SelectItem>
                                <SelectItem value={AssetType.EQUIPMENT}>Equipment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Location selector - only show if not site */}
                    {formType !== AssetType.SITE && formType !== null && (
                        <div className="grid gap-2">
                            <Label htmlFor="locationId">Location</Label>
                            <Select name="locationId">
                                <SelectTrigger>
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
                            <Label htmlFor="categoryId">Category</Label>
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

                    {/* Custom image upload section */}
                    <div className="grid gap-2">
                        <Label htmlFor="image">Image (optional)</Label>
                        <div className="mt-2">
                            {isUploading ? (
                                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <span className="ml-2">Uploading image...</span>
                                </div>
                            ) : !previewImage ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Hidden file inputs */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/png,image/jpeg,image/gif"
                                        onChange={handleFileChange}
                                    />
                                    <input
                                        type="file"
                                        ref={cameraInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileChange}
                                    />

                                    {/* Camera button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex flex-col items-center justify-center h-32 p-4 border-2 border-dashed"
                                        onClick={() => cameraInputRef.current?.click()}
                                    >
                                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium">Take a photo</span>
                                    </Button>

                                    {/* Upload button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex flex-col items-center justify-center h-32 p-4 border-2 border-dashed"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium">Choose an image</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-64 object-contain bg-gray-100 rounded-lg border"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={removeImage}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Create Asset
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
