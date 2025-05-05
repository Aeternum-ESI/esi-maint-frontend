"use client";

import { Button } from "@/components/ui/button";
import { Report } from "@/lib/types";
import { Download } from "lucide-react";
import { useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonsProps {
    reports: Report[];
}

export default function ExportButtons({ reports }: ExportButtonsProps) {
    const [isExporting, setIsExporting] = useState(false);

    // Export to CSV function
    const exportToCSV = () => {
        setIsExporting(true);
        try {
            // Create CSV header based on Report properties
            const headers = ["ID", "Title", "Date", "Status", "Category"]; // Adjust based on actual Report fields

            // Convert reports to CSV rows
            const data = reports.map((report) => [
                report.id,
                report.description,
                report.createdAt,
                report.status,
                report.category,
                // Add other fields as needed
            ]);

            // Combine headers and rows
            const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n");

            // Create a Blob and download link
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `reports-export-${new Date().toISOString().split("T")[0]}.csv`);
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
            doc.text("Reports Export", 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            // Convert reports to table data, ensuring no undefined/null values
            const tableData = reports.map((report) => [
                report.id ?? "",
                report.description ?? "",
                report.createdAt ?? "",
                report.status ?? "",
                typeof report.category === "string" ? report.category : report.category?.toString() ?? "",
                // Add other fields as needed, ensuring no undefined/null and converting to string if necessary
            ]);

            // Add table with report data
            autoTable(doc, {
                head: [["ID", "Title", "Date", "Status", "Category"]],
                body: tableData,
                startY: 40,
            });

            // Save the PDF
            doc.save(`reports-export-${new Date().toISOString().split("T")[0]}.pdf`);
        } catch (error) {
            console.error("Error exporting to PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={isExporting || reports.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF} disabled={isExporting || reports.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
            </Button>
        </div>
    );
}
