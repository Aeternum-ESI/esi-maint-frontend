"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Clock, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function CompletedInterventions() {
    const [interventions, setInterventions] = useState([]);
    const [filteredInterventions, setFilteredInterventions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIntervention, setSelectedIntervention] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchCompletedInterventions();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredInterventions(interventions);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = interventions.filter(
                (intervention) =>
                    intervention.description.toLowerCase().includes(lowercasedTerm) ||
                    intervention.interventionRequest.title.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredInterventions(filtered);
        }
    }, [searchTerm, interventions]);

    const fetchCompletedInterventions = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/technician/interventions");

            if (!response.ok) {
                throw new Error("Failed to fetch interventions");
            }

            const data = await response.json();
            setInterventions(data);
            setFilteredInterventions(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load interventions. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (intervention) => {
        setSelectedIntervention(intervention);
        setShowDetails(true);
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
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Completed Interventions</CardTitle>
                            <CardDescription>Your history of completed interventions</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search interventions..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredInterventions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium">No interventions found</h3>
                            <p className="text-muted-foreground">You haven't created any interventions yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredInterventions.map((intervention) => (
                                <Card key={intervention.id} className="overflow-hidden border border-gray-200">
                                    <CardContent className="pt-6 pb-4">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {intervention.interventionRequest.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                    {intervention.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(intervention.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:items-end gap-2">
                                                <Badge variant="outline">
                                                    {intervention.interventionRequest.status}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(intervention)}
                                                    className="mt-2"
                                                >
                                                    <FileText className="h-4 w-4 mr-2" /> View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Intervention Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Intervention Details</DialogTitle>
                    </DialogHeader>
                    {selectedIntervention && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {selectedIntervention.interventionRequest.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Intervention ID: #{selectedIntervention.id}
                                </p>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{selectedIntervention.description}</p>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Intervention Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="font-medium">Created</span>
                                            <span>{new Date(selectedIntervention.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-medium">Request Status</span>
                                            <Badge>{selectedIntervention.interventionRequest.status}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Related Request</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="font-medium">Request ID</span>
                                            <span>#{selectedIntervention.interventionRequestId}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-medium">Created By</span>
                                            <span>
                                                {selectedIntervention.interventionRequest.creator?.name || "Unknown"}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {selectedIntervention.interventionRequest.report && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Report Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="font-medium">Report ID</span>
                                            <span>#{selectedIntervention.interventionRequest.report.id}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b">
                                            <span className="font-medium">Report Type</span>
                                            <Badge variant="outline">
                                                {selectedIntervention.interventionRequest.report.type}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-medium">Reporter</span>
                                            <span>
                                                {selectedIntervention.interventionRequest.report.reporter?.name ||
                                                    "Unknown"}
                                            </span>
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
