"use client";

import { CreatePreventiveTaskData } from "@/app/actions/tasks.action";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type PlanificationFormProps = {
  selectedDate: Date | null;
  onSubmit: (data: CreatePreventiveTaskData) => Promise<{ success: boolean; message: string }>;
  assets: Asset[];
  categories: Category[];
};

export function PlanificationForm({ selectedDate, onSubmit, assets, categories }: PlanificationFormProps) {
  const [isAssetSelected, setIsAssetSelected] = useState<boolean>(true);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [period, setPeriod] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [assetPopoverOpen, setAssetPopoverOpen] = useState(false);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  // Periods options
  const periodOptions = [
    { value: "daily", label: "Chaque jour" },
    { value: "weekly", label: "Chaque semaine" },
    { value: "biweekly", label: "Toutes les 2 semaines" },
    { value: "monthly", label: "Chaque mois" },
    { value: "quarterly", label: "Chaque trimestre" },
    { value: "biannually", label: "Chaque semestre" },
    { value: "annually", label: "Chaque année" },
  ];

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error("Veuillez sélectionner une date de début");
      return;
    }
    
    if (isAssetSelected && !selectedAssetId) {
      toast.error("Veuillez sélectionner un asset");
      return;
    }
    
    if (!isAssetSelected && !selectedCategoryId) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    
    if (!period) {
      toast.error("Veuillez sélectionner une période");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Veuillez ajouter une description");
      return;
    }

    setIsSubmitting(true);

    try {
      const data: CreatePreventiveTaskData = {
        startDate: selectedDate.toISOString(),
        period: period,
        description: description,
      };

      if (isAssetSelected) {
        data.assetId = selectedAssetId;
      } else {
        data.categoryId = selectedCategoryId;
      }

      const result = await onSubmit(data);
      
      if (result.success) {
        toast.success(result.message);
        // Reset form
        setSelectedAssetId(null);
        setSelectedCategoryId(null);
        setPeriod("");
        setDescription("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la planification");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toggle between asset or category */}
      <div className="flex items-center space-x-4 py-2">
        <Button 
          type="button" 
          variant={isAssetSelected ? "default" : "outline"}
          onClick={() => setIsAssetSelected(true)}
          className="flex-1"
        >
          Asset spécifique
        </Button>
        <Button 
          type="button" 
          variant={!isAssetSelected ? "default" : "outline"}
          onClick={() => setIsAssetSelected(false)}
          className="flex-1"
        >
          Catégorie d'assets
        </Button>
      </div>
      
      {/* Asset Selector with Command */}
      {isAssetSelected && (
        <div className="grid gap-2">
          <Label htmlFor="asset">Asset</Label>
          <Popover open={assetPopoverOpen} onOpenChange={setAssetPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={assetPopoverOpen}
                className="justify-between w-full"
              >
                {selectedAssetId
                  ? assets.find((asset) => asset.id === selectedAssetId)?.name
                  : "Sélectionner un asset"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un asset..." />
                <CommandEmpty>Aucun asset trouvé.</CommandEmpty>
                <CommandGroup>
                  {assets.map((asset) => (
                    <CommandItem
                      key={asset.id}
                      value={asset.name}
                      onSelect={() => {
                        setSelectedAssetId(asset.id === selectedAssetId ? null : asset.id);
                        setAssetPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedAssetId === asset.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {asset.name} ({asset.type})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Category Selector with Command */}
      {!isAssetSelected && (
        <div className="grid gap-2">
          <Label htmlFor="category">Catégorie</Label>
          <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryPopoverOpen}
                className="justify-between w-full"
              >
                {selectedCategoryId
                  ? flattenedCategories.find((category) => category.id === selectedCategoryId)?.name
                  : "Sélectionner une catégorie"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto">
              <Command>
                <CommandInput placeholder="Rechercher une catégorie..." />
                <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                <CommandGroup>
                  {flattenedCategories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => {
                        setSelectedCategoryId(category.id === selectedCategoryId ? null : category.id);
                        setCategoryPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategoryId === category.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Period Selector */}
      <div className="grid gap-2">
        <Label htmlFor="period">Période</Label>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea 
          id="description"
          placeholder="Description détaillée de la tâche préventive..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !selectedDate}>
          {isSubmitting ? "Planification en cours..." : "Planifier"}
        </Button>
      </div>
    </form>
  );
}