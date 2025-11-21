"use client";

import React from "react";
import { ValidationResult } from "@/types";

interface FeedbackDisplayProps {
  result: ValidationResult | null;
  isVisible: boolean;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  result,
  isVisible,
}) => {
  if (!isVisible || !result) return null;

  const isOk = result.isOk;

  return (
    <div
      className={`animate-in fade-in safe-area-inset absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-6 py-8 text-center backdrop-blur-sm duration-300`}
    >
      <div
        className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${isOk ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} `}
      >
        <span className="text-5xl font-bold select-none">
          {isOk ? "○" : "×"}
        </span>
      </div>

      <h2 className="mb-4 text-2xl font-bold text-foreground">
        {isOk ? "確認 OK!" : "確認 NG"}
      </h2>

      <p className="px-4 text-lg leading-relaxed text-muted-foreground">
        {result.message}
      </p>

      {!isOk && result.reason && (
        <p className="mt-4 max-w-md rounded bg-destructive/10 px-4 py-2.5 text-sm leading-relaxed text-destructive-foreground">
          理由: {result.reason}
        </p>
      )}
    </div>
  );
};
