"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Define chart data type
type ChartData = {
    name: string;
    value: number;
}[];

// Colors for charts
const COLORS = [
    "#0088FE", // blue
    "#00C49F", // teal
    "#FFBB28", // yellow
    "#FF8042", // orange
    "#8884d8", // purple
    "#82ca9d", // green
    "#ff6b6b", // red
    "#a29bfe", // lavender
];

export function DonutChart({ data }: { data: ChartData }) {
    if (!data || data.length === 0) {
        return <div className="h-full w-full flex items-center justify-center">No data available</div>;
    }

    return (
        <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={300}
                        nameKey="name"
                        label={(entry) => entry.name}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [value, "Count"]}
                        labelFormatter={(name: string) => `${name}`}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function BarList({ data }: { data: ChartData }) {
    return (
        <div className="h-96 w-full ">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                    />
                    <Tooltip formatter={(value: number) => [value, "Count"]} />
                    <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
