"use client";

import React from "react";
import { Step } from "@/types";

interface StepIndicatorProps {
  step: Step;
  currentStepIndex: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  currentStepIndex,
  totalSteps,
}) => {
  return (
    <div className="pt-safe absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-black/85 via-black/70 to-transparent p-4 text-white">
      <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
        <span className="font-medium">
          STEP {currentStepIndex + 1} / {totalSteps}
        </span>
        <span className="rounded border border-yellow-500/30 bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-300">
          安全第一
        </span>
      </div>

      <h1 className="mb-1.5 text-lg leading-snug font-bold">{step.title}</h1>
      <p className="mb-2 text-sm leading-relaxed opacity-90">
        {step.description}
      </p>

      {step.dangerPoints.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {step.dangerPoints.map((point, idx) => (
            <span
              key={idx}
              className="flex items-center rounded bg-red-900/60 px-2 py-1 text-xs leading-relaxed text-red-200"
            >
              ⚠️ {point}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
