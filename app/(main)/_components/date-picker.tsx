"use client";

import { useMemo, useState } from "react";
import {
  format,
  startOfToday,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Adjust this import as needed
import { Separator } from "@/components/ui/separator";

type DateRangeOption =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "custom";

export function DatePickerWithPresets({
  className,
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [preset, setPreset] = useState<DateRangeOption>("custom");
  const [month, setMonth] = useState<Date | undefined>(); // State to control calendar month view

  // Determine screen size for responsiveness
  const isMobile =
    useMediaQuery("(max-width: 768px)") || window.innerWidth <= 768;
  const numberOfMonths = isMobile ? 1 : 2;

  // Function to update date range based on preset
  const updateDateRange = (selectedPreset: DateRangeOption) => {
    const today = startOfToday();
    let newDate: DateRange | undefined = undefined;

    switch (selectedPreset) {
      case "today":
        newDate = { from: today, to: today };
        break;
      case "yesterday":
        newDate = { from: subDays(today, 1), to: subDays(today, 1) };
        break;
      case "last_7_days":
        newDate = { from: subDays(today, 6), to: today };
        break;
      case "last_30_days":
        newDate = { from: subDays(today, 29), to: today };
        break;
      case "this_week":
        newDate = { from: startOfWeek(today), to: endOfWeek(today) };
        break;
      case "last_week":
        newDate = {
          from: startOfWeek(subDays(today, 7)),
          to: endOfWeek(subDays(today, 7)),
        };
        break;
      case "this_month":
        newDate = { from: startOfMonth(today), to: endOfMonth(today) };
        break;
      case "last_month": {
        const lastMonthDate = subDays(startOfMonth(today), 1);
        newDate = {
          from: startOfMonth(lastMonthDate),
          to: endOfMonth(lastMonthDate),
        };
        break;
      }
      case "this_year":
        newDate = { from: startOfYear(today), to: endOfYear(today) };
        break;
      case "last_year": {
        const lastYearDate = subDays(startOfYear(today), 1);
        newDate = {
          from: startOfYear(lastYearDate),
          to: endOfYear(lastYearDate),
        };
        break;
      }
      case "custom":
      default:
        newDate = undefined;
        break;
    }

    setDate(newDate);
    setMonth(newDate?.from); // Update calendar to show the selected date range's start month
  };

  // Handle preset change
  const handlePresetChange = (selectedPreset: DateRangeOption) => {
    setPreset(selectedPreset);
    updateDateRange(selectedPreset);
  };

  // Handle manual date range selection
  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    setPreset("custom");
    setMonth(range?.from); // Update calendar to show the custom date range's start month
  };

  const dateText = useMemo(() => {
    if (date?.from && date?.to) {
      return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    }

    if (date?.from) {
      return format(date.from, "LLL dd, y");
    }

    return <span>Pick a date range</span>;
  }, [date]);

  return (
    <div className={cn("grid gap-4", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[350px] justify-start text-left font-normal", // Full-width button
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", isMobile ? "w-full" : "")}>
          <div className="flex h-full flex-col p-4">
            {/* Date Picker */}
            <Calendar
              initialFocus
              mode="range"
              month={month} // Control the calendar's displayed month
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={numberOfMonths}
              className="mt-4 w-full"
            />
            <Separator className="my-4" />
            {/* Dropdown for Preset Selection */}
            <Select
              value={preset}
              onValueChange={(value) =>
                handlePresetChange(value as DateRangeOption)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Preset" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
