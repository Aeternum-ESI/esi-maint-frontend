"use client";

import { useState } from "react";
import { Asset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Import jsPDF and autotable if already installed
// If not installed, run: npm install jspdf jspdf-autotable
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportAssetsProps {
    assets: Asset[];
}

export default function ExportAssets({ assets }: ExportAssetsProps) {
    const [isExporting, setIsExporting] = useState(false);

    // Export to CSV function
    const exportToCSV = () => {
        setIsExporting(true);
        try {
            // Create CSV header based on Asset properties
            const headers = ["ID", "Name", "Category", "Location", "Status", "Serial Number"]; // Adjust based on actual Asset fields

            // Convert assets to CSV rows
            const data = assets.map((asset) => [
                asset.id,
                asset.name,
                asset.category?.name || "",
                asset.location?.name || "",
                asset.status,
                asset.inventoryCode,
                // Add other fields as needed
            ]);

            // Combine headers and rows
            const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n");

            // Create a Blob and download link
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `assets-export-${new Date().toISOString().split("T")[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting to CSV:", error);
        } finally {
            setIsExporting(false);
        }
    };

    // Export to PDF function
    const exportToPDF = () => {
        setIsExporting(true);
        try {
            const doc = new jsPDF();

            // Add title
            doc.setFontSize(18);
            doc.text("Assets Export", 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            // Convert assets to table data
            const tableData = assets.map((asset) => [
                asset.id,
                asset.name,
                asset.category?.name || "",
                asset.location?.name || "",
                asset.status,
                asset.inventoryCode,
                // Add other fields as needed
            ]);

            // Add table with asset data
            autoTable(doc, {
                head: [["ID", "Name", "Category", "Location", "Status", "Serial Number"]],
                body: tableData,
                startY: 40,
            });

            // Save the PDF
            doc.save(`assets-export-${new Date().toISOString().split("T")[0]}.pdf`);
        } catch (error) {
            console.error("Error exporting to PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={isExporting || assets.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF} disabled={isExporting || assets.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
            </Button>
        </div>
    );
}
