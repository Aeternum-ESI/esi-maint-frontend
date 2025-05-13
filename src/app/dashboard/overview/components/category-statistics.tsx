"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree } from "lucide-react";
import { BarList } from "./charts";

type CategoryStatisticsProps = {
    topCategories?: {
        id: number;
        name: string;
        count: number;
    }[];
};

export function CategoryStatistics({ topCategories }: CategoryStatisticsProps) {
    const categoryData =
        topCategories?.map((cat) => ({
            name: cat.name,
            value: cat.count,
        })) || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Top Categories</CardTitle>
                    <CardDescription>Categories with most reports</CardDescription>
                </div>
                <FolderTree className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                {categoryData.length > 0 ? (
                    <div className="">
                        <BarList data={categoryData} />
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {categoryData.slice(0, 4).map((item, index) => (
                                <div key={index} className="flex justify-between items-center px-2 py-1 rounded-md bg-muted/40">
                                    <span className="text-sm truncate">{item.name}</span>
                                    <span className={`font-bold ${index === 0 ? 'text-red-500' :
                                            index === 1 ? 'text-amber-500' :
                                                'text-blue-500'
                                        }`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No category data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
