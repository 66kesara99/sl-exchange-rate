"use client";

import { useState, useEffect } from "react";
import { BugIcon as Spider, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  text?: string;
  variant?: "default" | "spider" | "dots";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  showText = true,
  text = "Crawling web pages...",
  variant = "spider",
  className,
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState("");

  // Animate the dots for the loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Size mappings
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = {
    sm: "text-xs gap-2",
    md: "text-sm gap-3",
    lg: "text-base gap-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        containerClasses[size],
        className
      )}
    >
      {variant === "spider" && (
        <div className="relative">
          <Spider
            className={cn("animate-bounce text-primary", sizeClasses[size])}
          />
          <div className="absolute inset-0 animate-ping opacity-30">
            <Spider className={cn("text-primary/50", sizeClasses[size])} />
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-dashed border-primary/30 animate-spin" />
        </div>
      )}

      {variant === "default" && (
        <Loader2
          className={cn("animate-spin text-primary", sizeClasses[size])}
        />
      )}

      {variant === "dots" && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full animate-bounce",
                sizeClasses.sm,
                {
                  "animation-delay-100": i === 0,
                  "animation-delay-200": i === 1,
                  "animation-delay-300": i === 2,
                }
              )}
              style={{
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      )}

      {showText && (
        <p className="text-muted-foreground font-medium">
          {text}
          {variant !== "dots" && dots}
        </p>
      )}
    </div>
  );
}
