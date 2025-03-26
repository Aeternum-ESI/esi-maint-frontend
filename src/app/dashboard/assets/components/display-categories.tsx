"use client";
import { createCategory, deleteCategory, updateCategory } from "@/app/actions/categories.action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight, Edit, Loader2, MoveUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const DisplayCategories = ({ categories: initialCategories }: { categories: Category[] }) => {
    // State for categories with optimistic updates
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    // Dialogs state
    const [showAddRootDialog, setShowAddRootDialog] = useState(false);
    const [showAddSubDialog, setShowAddSubDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);

    // Form state
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [editCategoryName, setEditCategoryName] = useState("");
    const [editCategoryDescription, setEditCategoryDescription] = useState("");
    const [targetParentId, setTargetParentId] = useState<number | null>(null);

    // Selected category state (for edit/delete/add-sub operations)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Loading states for optimistic updates
    const [pendingOperations, setPendingOperations] = useState<Record<number, string>>({});
    const [isAddingRoot, setIsAddingRoot] = useState(false);

    // Function to reset all dialog states
    const resetDialogs = () => {
        setShowAddRootDialog(false);
        setShowAddSubDialog(false);
        setShowEditDialog(false);
        setShowDeleteDialog(false);
        setShowMoveDialog(false);
        setNewCategoryName("");
        setNewCategoryDescription("");
        setEditCategoryName("");
        setEditCategoryDescription("");
        setTargetParentId(null);
        setSelectedCategory(null);
    };

    // ===== Root Category Operations =====
    const handleAddRootCategory = async () => {
        if (!newCategoryName.trim()) return;

        setIsAddingRoot(true);

        // Create a temporary ID for optimistic updates
        const tempId = Date.now();

        // Create a new category object
        const newCategory: Category = {
            id: tempId,
            name: newCategoryName,
            description: newCategoryDescription,
            parentId: null,
            children: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Optimistically update UI
        setCategories((prev) => [...prev, newCategory]);

        try {
            await createCategory({
                name: newCategoryName,
                description: newCategoryDescription,
                parentId: null,
            });

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Category added successfully");
        } catch (error) {
            // Revert optimistic update on error
            setCategories((prev) => prev.filter((cat) => cat.id !== tempId));
            toast.error("Failed to add category");
            console.error(error);
        } finally {
            setIsAddingRoot(false);
            resetDialogs();
        }
    };

    // ===== Subcategory Operations =====
    const handleAddSubcategory = (parent: Category) => {
        setSelectedCategory(parent);
        setShowAddSubDialog(true);
    };

    const submitAddSubcategory = async () => {
        if (!selectedCategory || !newCategoryName.trim()) return;

        // Mark parent as having a pending operation
        setPendingOperations((prev) => ({ ...prev, [selectedCategory.id]: "adding-child" }));

        // Create a temporary ID for the new subcategory
        const tempId = Date.now();

        // Create a new category object
        const newCategory: Category = {
            id: tempId,
            name: newCategoryName,
            description: newCategoryDescription,
            parentId: selectedCategory.id,
            children: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Create a deep copy of the categories and update it with the new subcategory
        const updateCategories = (cats: Category[]): Category[] => {
            return cats.map((cat) => {
                if (cat.id === selectedCategory.id) {
                    return {
                        ...cat,
                        children: [...(cat.children || []), newCategory],
                    };
                } else if (cat.children && cat.children.length > 0) {
                    return {
                        ...cat,
                        children: updateCategories(cat.children),
                    };
                }
                return cat;
            });
        };

        // Optimistically update UI
        setCategories(updateCategories);

        try {
            await createCategory({
                name: newCategoryName,
                description: newCategoryDescription,
                parentId: selectedCategory.id,
            });
            toast.success(`Subcategory added to ${selectedCategory.name}`);
        } catch (error) {
            // Revert optimistic update on error
            const revertCategories = (cats: Category[]): Category[] => {
                return cats.map((cat) => {
                    if (cat.id === selectedCategory.id) {
                        return {
                            ...cat,
                            children: (cat.children || []).filter((child) => child.id !== tempId),
                        };
                    } else if (cat.children && cat.children.length > 0) {
                        return {
                            ...cat,
                            children: revertCategories(cat.children),
                        };
                    }
                    return cat;
                });
            };

            setCategories(revertCategories);
            toast.error("Failed to add subcategory");
            console.error(error);
        } finally {
            setPendingOperations((prev) => {
                const newState = { ...prev };
                delete newState[selectedCategory.id];
                return newState;
            });
            resetDialogs();
        }
    };

    // ===== Edit Category Operations =====
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setEditCategoryName(category.name);
        setEditCategoryDescription(category.description || "");
        setShowEditDialog(true);
    };

    const submitEditCategory = async () => {
        if (!selectedCategory || !editCategoryName.trim()) return;

        // Mark category as having a pending operation
        setPendingOperations((prev) => ({ ...prev, [selectedCategory.id]: "updating" }));

        // Store original values for potential rollback
        const originalName = selectedCategory.name;
        const originalDescription = selectedCategory.description;

        // Create a deep copy of the categories and update it with the edited category
        const updateCategories = (cats: Category[]): Category[] => {
            return cats.map((cat) => {
                if (cat.id === selectedCategory.id) {
                    return {
                        ...cat,
                        name: editCategoryName,
                        description: editCategoryDescription,
                        updatedAt: new Date().toISOString(),
                    };
                } else if (cat.children && cat.children.length > 0) {
                    return {
                        ...cat,
                        children: updateCategories(cat.children),
                    };
                }
                return cat;
            });
        };

        // Optimistically update UI
        setCategories(updateCategories);

        try {
            await updateCategory(selectedCategory.id, {
                name: editCategoryName,
                description: editCategoryDescription,
            });

            toast.success(`Category updated successfully`);
        } catch (error) {
            // Revert optimistic update on error
            const revertCategories = (cats: Category[]): Category[] => {
                return cats.map((cat) => {
                    if (cat.id === selectedCategory.id) {
                        return {
                            ...cat,
                            name: originalName,
                            description: originalDescription,
                        };
                    } else if (cat.children && cat.children.length > 0) {
                        return {
                            ...cat,
                            children: revertCategories(cat.children),
                        };
                    }
                    return cat;
                });
            };

            setCategories(revertCategories);
            toast.error("Failed to update category");
            console.error(error);
        } finally {
            setPendingOperations((prev) => {
                const newState = { ...prev };
                delete newState[selectedCategory.id];
                return newState;
            });
            resetDialogs();
        }
    };

    // ===== Delete Category Operations =====
    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteDialog(true);
    };

    const confirmDeleteCategory = async () => {
        if (!selectedCategory) return;

        // Mark category as having a pending operation
        setPendingOperations((prev) => ({ ...prev, [selectedCategory.id]: "deleting" }));

        // Store the category and its path in the tree for potential rollback
        let removedCategory: Category | null = null;
        let parentCategory: Category | null = null;

        // Function to remove a category from the tree and capture it for rollback
        const removeCategory = (cats: Category[], parentCat: Category | null = null): Category[] => {
            return cats.filter((cat) => {
                if (cat.id === selectedCategory!.id) {
                    removedCategory = { ...cat };
                    parentCategory = parentCat;
                    return false;
                }

                if (cat.children && cat.children.length > 0) {
                    cat.children = removeCategory(cat.children, cat);
                }

                return true;
            });
        };

        // Optimistically update UI
        setCategories(removeCategory);

        try {
            await deleteCategory(selectedCategory.id);

            toast.success(`Category deleted successfully`);
        } catch (error) {
            // Revert optimistic update on error
            if (removedCategory) {
                if (parentCategory) {
                    // If the category had a parent, we need to add it back to its parent's children
                    const revertCategories = (cats: Category[]): Category[] => {
                        return cats.map((cat) => {
                            if (cat.id === parentCategory!.id) {
                                return {
                                    ...cat,
                                    children: [...(cat.children || []), removedCategory!],
                                };
                            } else if (cat.children && cat.children.length > 0) {
                                return {
                                    ...cat,
                                    children: revertCategories(cat.children),
                                };
                            }
                            return cat;
                        });
                    };

                    setCategories(revertCategories);
                } else {
                    // If it was a root category, just add it back to the categories array
                    setCategories((prev) => [...prev, removedCategory!]);
                }
            }

            toast.error("Failed to delete category");
            console.error(error);
        } finally {
            setPendingOperations((prev) => {
                const newState = { ...prev };
                delete newState[selectedCategory.id];
                return newState;
            });
            resetDialogs();
        }
    };

    // Helper function to check if a potential parent is valid (not the category itself or its descendant)
    const isValidParent = (potentialParent: Category, category: Category): boolean => {
        if (potentialParent.id === category.id) return false;

        // Check if the category is an ancestor of the potential parent
        const isAncestor = (cat: Category, ancestorId: number): boolean => {
            if (cat.id === ancestorId) return true;
            if (!cat.parentId) return false;

            // Find the parent category
            const findParent = (categories: Category[], id: number): Category | null => {
                for (const c of categories) {
                    if (c.id === id) return c;
                    if (c.children && c.children.length > 0) {
                        const found = findParent(c.children, id);
                        if (found) return found;
                    }
                }
                return null;
            };

            const parent = findParent(categories, cat.parentId);
            if (!parent) return false;

            return isAncestor(parent, ancestorId);
        };

        return !isAncestor(potentialParent, category.id);
    };

    // Get all possible parent categories (excluding self and descendants)
    const getPossibleParents = (): Category[] => {
        if (!selectedCategory) return [];

        const validParents: Category[] = [];

        const addIfValid = (cat: Category) => {
            if (isValidParent(cat, selectedCategory)) {
                validParents.push(cat);
            }
        };

        // Recursively add valid parents
        const processCategories = (cats: Category[]) => {
            for (const cat of cats) {
                addIfValid(cat);
                if (cat.children && cat.children.length > 0) {
                    processCategories(cat.children);
                }
            }
        };

        processCategories(categories);
        return validParents;
    };

    const submitMoveCategory = async () => {
        if (!selectedCategory) return;

        // Mark category as having a pending operation
        setPendingOperations((prev) => ({ ...prev, [selectedCategory.id]: "moving" }));

        // Store the original parent ID for potential rollback
        const originalParentId = selectedCategory.parentId;

        // Create a deep copy of the selected category with all its children intact
        const categoryToMove = JSON.parse(JSON.stringify(selectedCategory));

        // Update the parentId of the category copy
        categoryToMove.parentId = targetParentId;
        categoryToMove.updatedAt = new Date().toISOString();

        // Recursive function to rebuild the category tree
        const rebuildTree = (cats: Category[]): Category[] => {
            // Filter out the category to be moved at all levels
            return cats
                .filter((cat) => cat.id !== selectedCategory.id)
                .map((cat) => {
                    if (cat.children && cat.children.length > 0) {
                        return {
                            ...cat,
                            children: rebuildTree(cat.children),
                        };
                    }
                    return { ...cat };
                });
        };

        // Recursive function to find a category by ID and add a child to it
        const addChildToParent = (cats: Category[], parentId: number, childToAdd: Category): Category[] => {
            return cats.map((cat) => {
                if (cat.id === parentId) {
                    return {
                        ...cat,
                        children: [...(cat.children || []), childToAdd],
                    };
                } else if (cat.children && cat.children.length > 0) {
                    return {
                        ...cat,
                        children: addChildToParent(cat.children, parentId, childToAdd),
                    };
                }
                return cat;
            });
        };

        // Start with a clean tree without the category to move
        let newCategories = rebuildTree(categories);

        // Add the category to its new parent or as a root
        if (targetParentId !== null) {
            newCategories = addChildToParent(newCategories, targetParentId, categoryToMove);
        } else {
            // Add as a root category
            newCategories.push(categoryToMove);
        }

        // Save the current state for potential rollback
        const previousCategories = JSON.parse(JSON.stringify(categories));

        // Optimistically update UI
        setCategories(newCategories);

        try {
            await updateCategory(selectedCategory.id, {
                parentId: targetParentId,
            });

            toast.success(`Category moved successfully`);
        } catch (error) {
            // On error, revert to the previous state
            setCategories(previousCategories);
            toast.error("Failed to move category");
            console.error(error);
        } finally {
            setPendingOperations((prev) => {
                const newState = { ...prev };
                delete newState[selectedCategory.id];
                return newState;
            });
            resetDialogs();
        }
    };

    // ===== Move Category Operations =====
    const handleMoveCategory = (category: Category) => {
        setSelectedCategory(category);
        setTargetParentId(category.parentId);
        setShowMoveDialog(true);
    };

    return (
        <div className="space-y-4 max-h-full min-h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Categories</h2>

                <Button onClick={() => setShowAddRootDialog(true)} className="bg-grey-blue hover:bg-oxford-blue">
                    <Plus className="h-4 w-4 mr-2 " />
                    Ajouter une catégorie
                </Button>
            </div>

            <Card className="p-4 h-full overflow-auto">
                {categories.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                        No categories found. Add a category to get started.
                    </div>
                ) : (
                    <CategoryTree
                        categories={categories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        onAdd={handleAddSubcategory}
                        onMove={handleMoveCategory}
                        pendingOperations={pendingOperations}
                    />
                )}
            </Card>

            {/* Root Category Dialog */}
            <Dialog open={showAddRootDialog} onOpenChange={setShowAddRootDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Root Category</DialogTitle>
                        <DialogDescription>Create a new top-level category</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={newCategoryDescription}
                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                placeholder="Category description (optional)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => resetDialogs()}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddRootCategory} disabled={!newCategoryName.trim() || isAddingRoot}>
                            {isAddingRoot && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Subcategory Dialog */}
            <Dialog open={showAddSubDialog} onOpenChange={setShowAddSubDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Subcategory</DialogTitle>
                        <DialogDescription>Create a new subcategory under {selectedCategory?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Subcategory name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={newCategoryDescription}
                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                placeholder="Subcategory description (optional)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => resetDialogs()}>
                            Cancel
                        </Button>
                        <Button onClick={submitAddSubcategory} disabled={!newCategoryName.trim() || !selectedCategory}>
                            {pendingOperations[selectedCategory?.id || 0] === "adding-child" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Add Subcategory
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Update category information</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                placeholder="Category name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input
                                id="edit-description"
                                value={editCategoryDescription}
                                onChange={(e) => setEditCategoryDescription(e.target.value)}
                                placeholder="Category description (optional)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => resetDialogs()}>
                            Cancel
                        </Button>
                        <Button onClick={submitEditCategory} disabled={!editCategoryName.trim() || !selectedCategory}>
                            {pendingOperations[selectedCategory?.id || 0] === "updating" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Move Category Dialog */}
            <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move Category</DialogTitle>
                        <DialogDescription>Move "{selectedCategory?.name}" to a different parent</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="parent">New Parent</Label>
                            <Select
                                value={targetParentId?.toString() || "root"}
                                onValueChange={(value) => setTargetParentId(value === "root" ? null : parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a new parent" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="root">Root (No Parent)</SelectItem>
                                    {getPossibleParents().map((parent) => (
                                        <SelectItem key={parent.id} value={parent.id.toString()}>
                                            {parent.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground mt-1">
                                Select "Root" to make this a top-level category
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => resetDialogs()}>
                            Cancel
                        </Button>
                        <Button onClick={submitMoveCategory} disabled={!selectedCategory}>
                            {pendingOperations[selectedCategory?.id || 0] === "moving" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Move Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to delete "{selectedCategory?.name}".
                            {selectedCategory?.children && selectedCategory.children.length > 0 && (
                                <span className="font-bold"> This will also delete all its subcategories!</span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => resetDialogs()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteCategory}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {pendingOperations[selectedCategory?.id || 0] === "deleting" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

interface CategoryTreeProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onAdd: (parent: Category) => void;
    onMove: (category: Category) => void;
    pendingOperations: Record<number, string>;
}

function CategoryTree({ categories, onEdit, onDelete, onAdd, onMove, pendingOperations }: CategoryTreeProps) {
    return (
        <div className="category-tree">
            {categories.map((category) => (
                <CategoryNode
                    key={category.id}
                    category={category}
                    level={0}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAdd={onAdd}
                    onMove={onMove}
                    pendingOperations={pendingOperations}
                />
            ))}
        </div>
    );
}

interface CategoryNodeProps {
    category: Category;
    level: number;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onAdd: (parent: Category) => void;
    onMove: (category: Category) => void;
    pendingOperations: Record<number, string>;
}

function CategoryNode({ category, level, onEdit, onDelete, onAdd, onMove, pendingOperations }: CategoryNodeProps) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const isPending = Boolean(pendingOperations[category.id]);
    const operation = pendingOperations[category.id];

    return (
        <div
            className={cn("category-node", {
                "border-2 border-muted rounded-md m-1": category.parentId === null,
            })}
        >
            <div
                className={`flex items-center py-2 hover:bg-muted/50 rounded px-2 ${isPending ? "opacity-70" : ""}`}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
                {hasChildren ? (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mr-1 text-muted-foreground hover:text-foreground"
                        disabled={isPending}
                    >
                        <ChevronRight
                            className={cn("size-5 transition duration-150  text-oxford-blue ", {
                                "rotate-90": expanded,
                            })}
                        />
                    </button>
                ) : (
                    <span className="w-5" /> // Spacer for alignment
                )}

                <span className="flex-1 font-medium">
                    {category.name}
                    {isPending && operation === "deleting" && " (Deleting...)"}
                    {isPending && operation === "updating" && " (Updating...)"}
                    {isPending && operation === "adding-child" && " (Adding...)"}
                    {isPending && operation === "moving" && " (Moving...)"}
                </span>

                {category.description && (
                    <Badge variant="outline" className="mx-2 text-xs max-md:hidden">
                        {category.description.length > 30
                            ? `${category.description.substring(0, 30)}...`
                            : category.description}
                    </Badge>
                )}

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAdd(category)}
                        title="Add subcategory"
                        disabled={isPending}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(category)}
                        title="Edit category"
                        disabled={isPending}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMove(category)}
                        title="Move category"
                        disabled={isPending}
                    >
                        <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(category)}
                        title="Delete category"
                        disabled={isPending}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>

            {expanded && hasChildren && (
                <div className="category-children">
                    {category.children.map((child) => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            level={level + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAdd={onAdd}
                            onMove={onMove}
                            pendingOperations={pendingOperations}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
