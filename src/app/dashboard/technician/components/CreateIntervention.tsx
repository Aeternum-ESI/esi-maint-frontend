"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function CreateIntervention({ request, onSuccess }) {
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please provide a description for the intervention.",
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch("/api/technician/interventions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    interventionRequestId: request.interventionRequestId,
                    description,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create intervention");
            }

            toast({
                title: "Success",
                description: "Intervention created successfully.",
            });

            onSuccess();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to create intervention. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                    Creating intervention for request:{" "}
                    <span className="font-medium">{request.interventionRequest.title}</span>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                    Intervention Description
                </Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the work performed, actions taken, parts replaced, etc."
                    className="min-h-32"
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Please provide detailed information about the intervention, including any observations, actions
                    taken, parts replaced, and the outcome.
                </p>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onSuccess()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !description.trim()}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Create Intervention"
                    )}
                </Button>
            </div>
        </form>
    );
}
