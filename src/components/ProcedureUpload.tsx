"use client";

import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

interface ProcedureUploadProps {
  onUpload: (file: File) => void;
  onUseSample: () => void;
  isProcessing: boolean;
}

type UploadMode = "file" | "camera";

export const ProcedureUpload: React.FC<ProcedureUploadProps> = ({
  onUpload,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<UploadMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();

      // Check if it's a text file
      if (
        file.type.startsWith("text/") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md")
      ) {
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsText(file);
      } else {
        // Image file
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = () => {
    if (mode === "file" && selectedFile) {
      onUpload(selectedFile);
    } else if (mode === "camera" && preview) {
      // Convert base64 data URL to File object
      const file = dataURLtoFile(preview, `procedure-${Date.now()}.jpg`);
      onUpload(file);
    }
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPreview(imageSrc);
      }
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  // Convert base64 data URL to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <div className="pt-safe px-4 pb-4">
        <h1 className="mb-4 text-center text-2xl font-bold text-primary">
          Yoshi-Log AI
        </h1>

        {/* Mode Toggle */}
        <div className="mb-4 flex gap-2 rounded-lg bg-muted p-1">
          <button
            onClick={() => {
              setMode("file");
              setPreview(null);
              setSelectedFile(null);
            }}
            className={`min-h-[44px] flex-1 touch-manipulation rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === "file"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            } `}
          >
            ファイル選択
          </button>
          <button
            onClick={() => {
              setMode("camera");
              setPreview(null);
            }}
            className={`min-h-[44px] flex-1 touch-manipulation rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === "camera"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            } `}
          >
            カメラ撮影
          </button>
        </div>
      </div>

      <div className="safe-area-scroll flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-32">
        {mode === "file" ? (
          <div className="w-full max-w-md">
            <label
              htmlFor="procedure-upload"
              className={`relative flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors ${preview ? "border-primary bg-muted/50" : "border-border hover:border-primary/50 hover:bg-muted"} `}
            >
              {preview ? (
                selectedFile &&
                (selectedFile.type.startsWith("text/") ||
                  selectedFile.name.endsWith(".txt") ||
                  selectedFile.name.endsWith(".md")) ? (
                  <div className="absolute inset-0 h-full w-full overflow-auto p-4 text-sm whitespace-pre-wrap text-foreground">
                    {preview}
                  </div>
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-contain p-2"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="mb-3 h-10 w-10 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">
                      タップしてファイルを選択
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    画像またはテキストファイル（.txt, .md）
                  </p>
                </div>
              )}
              <input
                id="procedure-upload"
                type="file"
                accept="image/*,.txt,.md,text/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </label>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              紙の手順書の画像、またはテキストファイル（.txt,
              .md）をアップロードしてください。
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-border bg-black">
              {preview ? (
                <div className="relative h-full w-full">
                  <img
                    src={preview}
                    alt="Captured"
                    className="h-full w-full object-contain"
                  />
                  <button
                    onClick={handleRetake}
                    className="absolute top-2 right-2 min-h-[36px] touch-manipulation rounded bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground active:opacity-90"
                  >
                    撮り直す
                  </button>
                </div>
              ) : (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 720,
                      height: 1280,
                      facingMode: "environment",
                    }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-0 bottom-4 left-0 flex justify-center">
                    <button
                      onClick={handleCapture}
                      disabled={isProcessing}
                      className="h-20 w-20 touch-manipulation rounded-full border-4 border-border bg-background shadow-lg transition-colors active:bg-muted"
                      style={{ minWidth: "80px", minHeight: "80px" }}
                    >
                      <div className="mx-auto h-14 w-14 rounded-full border-2 border-muted-foreground bg-background"></div>
                    </button>
                  </div>
                </>
              )}
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              手順書をカメラで撮影してください。
            </p>
          </div>
        )}
      </div>

      <div className="pb-safe fixed right-0 bottom-0 left-0 space-y-3 border-t border-border bg-background p-4">
        {preview && (
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`min-h-[48px] w-full touch-manipulation rounded-lg py-4 text-base font-bold shadow-lg transition-all ${
              isProcessing
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground active:opacity-90"
            } `}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-primary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                手順書解析中...
              </span>
            ) : (
              "読み込む"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
