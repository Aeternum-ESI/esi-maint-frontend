"use client";

import { createProfession } from "@/app/actions/professions.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogContent, DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useState } from "react";

export const DisplayProfessions = ({
    professions,
}: {
    professions: {
        id: number;
        name: string;
    }[];
}) => {
    const [newProfession, setNewProfession] = useState("");
    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Professions</h2>
                <Dialog onOpenChange={setNewProfession.bind(null, "")}>
                    <DialogTrigger>
                        <Button>Add Profession</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log(newProfession);
                                createProfession(newProfession);
                            }}
                        >
                            <div className="p-4">
                                <h2 className="text-xl font-bold">Add Profession</h2>
                                <div className="mt-4">
                                    <input
                                        value={newProfession}
                                        onChange={(e) => setNewProfession(e.target.value)}
                                        type="text"
                                        placeholder="Profession name"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <DialogTrigger>
                                        <Button type="" disabled={!newProfession}>
                                            Add
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professions.map((profession) => (
                    <Card key={profession.id} className="p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{profession.name}</span>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
