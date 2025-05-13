"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type CalendarProps = {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    className?: string;
    minDate?: Date;
};

export function Calendar({ selectedDate, onSelectDate, className, minDate }: CalendarProps) {
    const [viewMonth, setViewMonth] = useState<Date>(selectedDate || new Date());

    // Navigation functions
    const prevMonth = () => {
        setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
    };

    const goToToday = () => {
        const today = new Date();
        setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        onSelectDate(today);
    };

    // Generate calendar days
    const generateCalendar = () => {
        const year = viewMonth.getFullYear();
        const month = viewMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        // Fill in days from previous month
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, lastDayOfPrevMonth - i),
                currentMonth: false,
                isToday: false,
            });
        }

        // Current month's days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({
                date,
                currentMonth: true,
                isToday:
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear(),
            });
        }

        // Fill any remaining slots with days from next month
        const daysNeeded = 42 - days.length; // 6 rows of 7 days
        for (let i = 1; i <= daysNeeded; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                currentMonth: false,
                isToday: false,
            });
        }

        return days;
    };

    const isDateDisabled = (date: Date) => {
        if (!minDate) return false;
        return date < new Date(minDate.setHours(0, 0, 0, 0));
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    const calendarDays = generateCalendar();

    return (
        <div className={cn("w-full select-none", className)}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <h2 className="font-medium text-lg">
                        {months[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                    </h2>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={goToToday} variant="outline" size="sm" className="text-xs">
                        Aujourd'hui
                    </Button>
                    <div className="flex">
                        <Button onClick={prevMonth} variant="outline" size="icon" className="rounded-r-none">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Mois précédent</span>
                        </Button>
                        <Button onClick={nextMonth} variant="outline" size="icon" className="rounded-l-none border-l-0">
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Mois suivant</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-1">
                {weekDays.map((day, index) => (
                    <div key={index} className="text-center text-xs font-medium text-muted-foreground p-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(({ date, currentMonth, isToday }, index) => {
                    const isSelected =
                        selectedDate &&
                        date.getDate() === selectedDate.getDate() &&
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getFullYear() === selectedDate.getFullYear();

                    const disabled = isDateDisabled(date);

                    return (
                        <button
                            key={index}
                            onClick={() => !disabled && onSelectDate(date)}
                            className={cn(
                                "text-center p-2 h-10 w-10 mx-auto rounded-md transition-colors",
                                !currentMonth && "text-muted-foreground opacity-50",
                                !disabled && !isSelected && "hover:bg-accent",
                                isSelected && "bg-primary text-primary-foreground font-semibold",
                                isToday && !isSelected && "border border-input",
                                disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                            )}
                            disabled={disabled}
                        >
                            <time dateTime={date.toISOString().split("T")[0]}>{date.getDate()}</time>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
