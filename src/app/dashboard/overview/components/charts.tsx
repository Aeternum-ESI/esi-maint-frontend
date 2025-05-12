"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Define chart data type
type ChartData = {
    name: string;
    value: number;
}[];

// Enhanced colors for charts - more vibrant and distinct
const COLORS = [
    "#3498db", // blue
    "#2ecc71", // green
    "#f39c12", // yellow
    "#e74c3c", // red
    "#9b59b6", // purple
    "#1abc9c", // teal
    "#e67e22", // orange
    "#34495e", // dark blue
];

// Custom tooltip that adds color
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const color = payload[0].color;
        return (
            <div className="bg-white p-2 border rounded shadow-md">
                <p className="font-medium" style={{ color }}>{payload[0].name}</p>
                <p className="text-sm">
                    Count: <span className="font-bold" style={{ color }}>{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

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
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={true}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function BarList({ data }: { data: ChartData }) {
    return (
        <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
