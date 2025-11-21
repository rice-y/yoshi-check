"use client";

import React from "react";
import { WorkLog, Procedure } from "@/types";

interface WorkLogSummaryProps {
  logs: WorkLog[];
  procedure: Procedure;
  onRestart: () => void;
}

export const WorkLogSummary: React.FC<WorkLogSummaryProps> = ({
  logs,
  procedure: _procedure,
  onRestart,
}) => {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <div className="safe-area-scroll flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold">作業完了</h1>
        <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
          すべての工程が正常に終了しました。
        </p>

        <div className="mb-4 overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border bg-muted px-4 py-2.5">
            <h2 className="text-sm font-bold text-foreground">作業ログ</h2>
          </div>
          <div className="divide-y divide-border">
            {logs.map((log, index) => (
              <div key={index} className="p-4">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <span className="flex-1 text-sm leading-snug font-bold text-foreground">
                    {log.stepTitle}
                  </span>
                  <span
                    className={`flex-shrink-0 rounded px-2.5 py-1 text-xs font-medium ${
                      log.result.isOk
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.result.isOk ? "OK" : "NG"}
                  </span>
                </div>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {log.result.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-safe fixed right-0 bottom-0 left-0 border-t border-border bg-background p-4">
        <button
          onClick={onRestart}
          className="min-h-[48px] w-full touch-manipulation rounded-lg bg-primary py-4 text-base font-bold text-primary-foreground shadow-lg transition-colors active:opacity-90"
        >
          トップに戻る
        </button>
      </div>
    </div>
  );
};
