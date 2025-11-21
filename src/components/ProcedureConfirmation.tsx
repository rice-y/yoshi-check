"use client";

import React from "react";
import { Procedure } from "@/types";

interface ProcedureConfirmationProps {
  procedure: Procedure;
  onStart: () => void;
}

export const ProcedureConfirmation: React.FC<ProcedureConfirmationProps> = ({
  procedure,
  onStart,
}) => {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <div className="safe-area-scroll flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <h1 className="mb-2 text-2xl font-bold text-primary">
          作業手順確認
        </h1>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          以下の手順と危険ポイントを確認し、準備ができたら開始してください。
        </p>

        <div className="mb-4 rounded-lg border border-border bg-card p-4">
          <h2 className="mb-1 text-lg font-bold">{procedure.title}</h2>
          <p className="text-xs text-muted-foreground">ID: {procedure.id}</p>
        </div>

        <div className="space-y-3 pb-4">
          {procedure.steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                  STEP {index + 1}
                </span>
              </div>
              <h3 className="mb-2 text-base leading-snug font-bold">
                {step.title}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {step.dangerPoints.length > 0 && (
                <div className="rounded border border-red-200 bg-red-50 p-3">
                  <p className="mb-2 text-xs font-bold text-red-800">
                    ⚠️ 危険予知ポイント
                  </p>
                  <ul className="list-inside list-disc space-y-1.5 text-xs text-red-700">
                    {step.dangerPoints.map((point, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pb-safe fixed right-0 bottom-0 left-0 z-10 border-t border-border bg-background p-4">
        <button
          onClick={onStart}
          className="min-h-[48px] w-full touch-manipulation rounded-lg bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-colors active:opacity-90"
        >
          作業を開始する
        </button>
      </div>
    </div>
  );
};
