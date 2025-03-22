"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { FileText, Download, FileDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithPresets } from "../_components/date-picker-range";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardParamsSchema } from "@/lib/schema/dashboard";
import { useGetExpensesByDate } from "@/api/queries/expenses-hook";
import { Skeleton } from "@/components/ui/skeleton";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportsPage = () => {
  const currentDate = new Date();
  const initialRender = useRef(true);

  const [queryParams, setQueryParams] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const [dateParams, setDateParams] = useState<DashboardParamsSchema>({
    dateRange: "this_month",
    startDate: format(new Date(), "yyyy-MM-01"),
    endDate: format(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      "yyyy-MM-dd",
    ),
  });

  // Add a state to track whether we need year data
  const [isYearData, setIsYearData] = useState(false);

  const { data, isLoading, error } = useGetExpensesByDate(queryParams);

  // Safely handle date changes without causing infinite loops
  const handleDateChange = (params: DashboardParamsSchema) => {
    // Update the date parameters first
    setDateParams(params);

    // Logic for setting query params based on date range
    if (params.dateRange === "last_year" || params.dateRange === "this_year") {
      const year =
        params.dateRange === "last_year"
          ? currentDate.getFullYear() - 1
          : currentDate.getFullYear();

      // Use December for last year, January for this year
      const month = params.dateRange === "last_year" ? 12 : 1;

      setQueryParams({
        month,
        year,
      });

      setIsYearData(true);
    } else if (params.startDate) {
      const startDate = new Date(params.startDate);
      setQueryParams({
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
      });

      setIsYearData(false);
    }
  };

  // On component mount only, set up initial state
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;

      // Initial setup logic, if needed
    }
  }, []);

  const exportToPDF = () => {
    if (!data?.expenses || data.expenses.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 22);

    // Add date range with correct formatting based on selection
    doc.setFontSize(11);
    if (isYearData) {
      doc.text(
        `Period: ${dateParams.dateRange === "last_year" ? "Last Year" : "This Year"}`,
        14,
        30,
      );
    } else {
      doc.text(
        `Period: ${dateParams.startDate} to ${dateParams.endDate}`,
        14,
        30,
      );
    }

    // Add summary
    doc.text(`Total Expenses: ₱${data.totalExpenses.toFixed(2)}`, 14, 40);

    // Add table
    const tableColumn = [
      "Date",
      "Description",
      "Category",
      "Amount",
      "Type",
      "Payment Method",
    ];
    const tableRows = data.expenses.map((expense) => [
      format(new Date(expense.startDate), "yyyy-MM-dd"),
      expense.description || "N/A",
      expense.category.name,
      `₱${expense.amount.toFixed(2)}`,
      expense.type,
      expense.paymentMethod,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: "striped",
      headStyles: { fillColor: [66, 135, 245] },
    });

    // Set filename with appropriate period description
    let filename = "expense-report";
    if (isYearData) {
      filename +=
        dateParams.dateRange === "last_year"
          ? `-${currentDate.getFullYear() - 1}`
          : `-${currentDate.getFullYear()}`;
    } else {
      filename += `-${format(new Date(), "yyyy-MM-dd")}`;
    }
    filename += ".pdf";

    doc.save(filename);
    toast.success("PDF exported successfully");
  };

  const exportToCSV = () => {
    if (!data?.expenses || data.expenses.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Set filename with appropriate period description
    let filename = "expense-report";
    if (isYearData) {
      filename +=
        dateParams.dateRange === "last_year"
          ? `-${currentDate.getFullYear() - 1}`
          : `-${currentDate.getFullYear()}`;
    } else {
      filename += `-${format(new Date(), "yyyy-MM-dd")}`;
    }
    filename += ".csv";

    const headers = [
      "Date",
      "Description",
      "Category",
      "Amount",
      "Type",
      "Payment Method",
    ];

    const csvRows = [
      headers.join(","),
      ...data.expenses.map((expense) =>
        [
          format(new Date(expense.startDate), "yyyy-MM-dd"),
          `"${(expense.description || "").replace(/"/g, '""')}"`,
          `"${expense.category.name.replace(/"/g, '""')}"`,
          expense.amount.toFixed(2),
          expense.type,
          expense.paymentMethod,
        ].join(","),
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  };

  return (
    <div className="container mx-auto max-w-screen-xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and export expense reports
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DatePickerWithPresets
            onDateChange={handleDateChange}
            initialPreset={dateParams.dateRange}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileDown className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Expense Report</CardTitle>
          <CardDescription>
            {isYearData
              ? `Showing expenses for ${dateParams.dateRange === "last_year" ? "last year" : "this year"}`
              : `Showing expenses from ${dateParams.startDate} to ${dateParams.endDate}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="py-4 text-center">
              <p className="text-red-500">Error loading expenses data</p>
            </div>
          ) : !data?.expenses || data.expenses.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">
                No expenses found for this period
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {format(new Date(expense.startDate), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>{expense.description || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: expense.category.color }}
                          />
                          {expense.category.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ₱{expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>{expense.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {data?.expenses ? data.expenses.length : 0} expense(s)
          </div>
          <div className="text-sm font-medium">
            Total: ₱{data?.totalExpenses?.toFixed(2) || "0.00"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportsPage;
