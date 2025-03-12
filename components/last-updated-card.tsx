"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface LastUpdatedProps {
  date?: Date | string;
  showTime?: boolean;
  showIcon?: boolean;
  variant?: "default" | "outline" | "secondary" | "destructive";
}

export function LastUpdated({
  date,
  showTime = true,
  showIcon = true,
  variant = "default",
}: LastUpdatedProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");

  useEffect(() => {
    const updateDate = date ? new Date(date) : new Date();
    setFormattedDate(format(updateDate, "MMMM d, yyyy"));
    setFormattedTime(format(updateDate, "h:mm a"));
  }, [date]);

  return (
    <div className="flex justify-center w-full my-2">
      <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
        {showIcon && <Calendar className="h-4 w-4 text-primary shrink-0" />}
        <span className="text-sm font-medium">Last Updated:</span>
        <Badge variant={variant} className="px-2 py-0.5 text-sm">
          {formattedDate}
        </Badge>
        {showTime && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1 shrink-0" />
            <span>{formattedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
}
