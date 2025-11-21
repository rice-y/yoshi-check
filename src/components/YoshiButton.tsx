"use client";

import React from "react";

interface YoshiButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const YoshiButton: React.FC<YoshiButtonProps> = ({
  onClick,
  disabled,
  loading,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative flex h-28 w-28 touch-manipulation items-center justify-center rounded-full border-4 border-white shadow-xl transition-transform active:scale-90 ${loading ? "cursor-not-allowed bg-gray-400" : "bg-red-600 active:bg-red-500"} ${disabled ? "cursor-not-allowed opacity-50" : ""} `}
      style={{ minWidth: "112px", minHeight: "112px" }}
    >
      {loading ? (
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      ) : (
        <span className="text-xl font-bold tracking-wider text-white select-none">
          よし！
        </span>
      )}

      {/* Ring animation effect */}
      {!disabled && !loading && (
        <span className="pointer-events-none absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
      )}
    </button>
  );
};
