"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { AssetType, type Asset, type Category, Priority } from "@/lib/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AssetFilters from "./asset-filters";
import AssetSearchBar from "./asset-search-bar";
import { Card } from "@/components/ui/card";
import { CldUploadButton } from "next-cloudinary";
import { uploadPreset } from "@/lib/cloudinary";
import { Camera, Image, X } from "lucide-react";
import { createReport } from "@/app/actions/reports.action";

interface ReportProblemFormProps {
    initialAssets: Asset[];
    categories: Category[];
}

export interface ReportFormData {
    assetId: number;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    imageUrl?: string;
}

export default function ReportProblemForm({ initialAssets, categories }: ReportProblemFormProps) {
    const router = useRouter();
    const [selectedAssetType, setSelectedAssetType] = useState<AssetType>(AssetType.EQUIPMENT);
    const [searchMode, setSearchMode] = useState<"filter" | "search">("filter");
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ReportFormData>();
    const priority = watch("priority");

    const filteredAssets = useMemo(() => {
        return initialAssets.filter((asset) => asset.type === selectedAssetType);
    }, [initialAssets, selectedAssetType]);

    const sites = useMemo(() => {
        return initialAssets.filter((asset) => asset.type === AssetType.SITE);
    }, [initialAssets]);

    const onSubmit = async (data: ReportFormData) => {
        data = {
            ...data,
            assetId: selectedAsset?.id || 0,
        };
        if (!selectedAsset) {
            toast.error("Please select an asset");
            return;
        }

        try {
            await createReport(data);

            toast.success("Problem reported successfully");
            reset();
            setSelectedAsset(null);
            setPreviewImage(null);
            router.push("/signaler/success");
        } catch (error) {
            toast.error("Error submitting the form");
            console.error(error);
        }
    };

    const handleSelectAsset = (asset: Asset) => {
        setSelectedAsset(asset);
    };

    const handleImageUploadSuccess = (result: any) => {
        const imageUrl = result.info.secure_url;
        setValue("imageUrl", imageUrl);
        setPreviewImage(imageUrl);
        toast.success("Image uploaded successfully!");
    };

    const removeImage = () => {
        setValue("imageUrl", undefined);
        setPreviewImage(null);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-medium mb-2">Selection Mode</h2>
                    <div className="flex space-x-4">
                        <Button
                            type="button"
                            variant={searchMode === "filter" ? "default" : "outline"}
                            onClick={() => setSearchMode("filter")}
                        >
                            Filter by hierarchy
                        </Button>
                        <Button
                            type="button"
                            variant={searchMode === "search" ? "default" : "outline"}
                            onClick={() => setSearchMode("search")}
                        >
                            Search by code
                        </Button>
                    </div>
                </div>

                {searchMode === "filter" ? (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-medium mb-2">Asset Type</h2>
                            <RadioGroup
                                defaultValue={selectedAssetType}
                                onValueChange={(value) => setSelectedAssetType(value as AssetType)}
                                className="flex space-x-4"
                            >
                                {Object.values(AssetType).map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <RadioGroupItem value={type} id={type} />
                                        <Label htmlFor={type}>{type}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <AssetFilters
                            selectedType={selectedAssetType}
                            allAssets={initialAssets}
                            sites={sites}
                            onSelectAsset={handleSelectAsset}
                        />
                    </div>
                ) : (
                    <AssetSearchBar assets={initialAssets} onSelectAsset={handleSelectAsset} />
                )}

                {selectedAsset && (
                    <Card className="p-4 bg-muted/50">
                        <h3 className="font-medium mb-2">Selected Asset:</h3>
                        <p>
                            <strong>Name:</strong> {selectedAsset.name}
                        </p>
                        <p>
                            <strong>Code:</strong> {selectedAsset.inventoryCode}
                        </p>
                        <p>
                            <strong>Type:</strong> {selectedAsset.type}
                        </p>
                        <p>
                            <strong>Status:</strong> {selectedAsset.status}
                        </p>
                    </Card>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-medium">Problem Details</h2>

                <div>
                    <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the problem encountered..."
                        {...register("description", { required: "Description is required" })}
                        className={errors.description ? "border-destructive" : ""}
                    />
                    {errors.description && (
                        <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="priority">
                        Priority <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        <div
                            className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                                priority === "LOW"
                                    ? "bg-green-100 border-green-500 ring-2 ring-green-500"
                                    : "hover:bg-green-50"
                            }`}
                            onClick={() => setValue("priority", "LOW")}
                        >
                            <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2"></div>
                            <p className="font-medium">Low</p>
                            <p className="text-xs text-gray-500">Non-urgent</p>
                        </div>
                        <div
                            className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                                priority === "MEDIUM"
                                    ? "bg-yellow-100 border-yellow-500 ring-2 ring-yellow-500"
                                    : "hover:bg-yellow-50"
                            }`}
                            onClick={() => setValue("priority", "MEDIUM")}
                        >
                            <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                            <p className="font-medium">Medium</p>
                            <p className="text-xs text-gray-500">Attention required</p>
                        </div>
                        <div
                            className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                                priority === "HIGH"
                                    ? "bg-red-100 border-red-500 ring-2 ring-red-500"
                                    : "hover:bg-red-50"
                            }`}
                            onClick={() => setValue("priority", "HIGH")}
                        >
                            <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2"></div>
                            <p className="font-medium">High</p>
                            <p className="text-xs text-gray-500">Urgent intervention</p>
                        </div>
                    </div>
                    <input type="hidden" {...register("priority", { required: true })} />
                </div>

                <div>
                    <Label htmlFor="image">Problem Photo (optional)</Label>
                    <div className="mt-2">
                        {!previewImage ? (
                            <div className="grid grid-cols-2 gap-3">
                                <CldUploadButton
                                    uploadPreset={"ESIMAINT"}
                                    options={{
                                        sources: ["camera"],
                                        multiple: false,
                                        maxFiles: 1,
                                        resourceType: "image",
                                        clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                                        maxFileSize: 10000000,
                                    }}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    onSuccess={(result, { close }) => {
                                        handleImageUploadSuccess(result);
                                        close();
                                    }}
                                    onError={(e) => console.log(e)}
                                >
                                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium">Take a photo</span>
                                </CldUploadButton>

                                <CldUploadButton
                                    uploadPreset={"ESIMAINT"}
                                    options={{
                                        sources: ["local"],
                                        multiple: false,
                                        maxFiles: 1,
                                        resourceType: "image",
                                        clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                                        maxFileSize: 10000000,
                                    }}
                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    onSuccess={(result, { close }) => {
                                        handleImageUploadSuccess(result);
                                        close();
                                    }}
                                >
                                    <Image className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium">Choose an image</span>
                                </CldUploadButton>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={previewImage || ""} 
                                    onError={(e) => {
                                        e.currentTarget.src = "/static/bigLogo.png";
                                    }}

                                    alt="Preview"
                                    className="w-full h-64 object-contain bg-gray-100 rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset();
                        setSelectedAsset(null);
                        setPreviewImage(null);
                    }}
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting || !selectedAsset}
                    className="bg-pumpkin hover:bg-pumpkin/90 text-white"
                >
                    {isSubmitting ? "Submitting..." : "Report Problem"}
                </Button>
            </div>
        </form>
    );
}
