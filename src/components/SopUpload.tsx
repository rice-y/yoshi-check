"use client";

import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

interface SopUploadProps {
  onUpload: (file: File) => void;
  onUseSample: () => void;
  isProcessing: boolean;
}

type UploadMode = "file" | "camera";

export const SopUpload: React.FC<SopUploadProps> = ({ onUpload, onUseSample, isProcessing }) => {
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
      if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
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
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      <div className="px-4 pt-safe pb-4">
        <h1 className="text-2xl font-bold text-primary mb-4 text-center">Yoshi-Log AI</h1>
        
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4 bg-muted p-1 rounded-lg">
          <button
            onClick={() => {
              setMode("file");
              setPreview(null);
              setSelectedFile(null);
            }}
            className={`
              flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px]
              ${mode === "file" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            ファイル選択
          </button>
          <button
            onClick={() => {
              setMode("camera");
              setPreview(null);
            }}
            className={`
              flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-[44px]
              ${mode === "camera" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            カメラ撮影
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32 overflow-y-auto safe-area-scroll">
        {mode === "file" ? (
          <div className="w-full max-w-md">
            <label 
              htmlFor="procedure-upload" 
              className={`
                flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
                transition-colors relative overflow-hidden
                ${preview ? "border-primary bg-muted/50" : "border-border hover:border-primary/50 hover:bg-muted"}
              `}
            >
              {preview ? (
                selectedFile && (selectedFile.type.startsWith("text/") || selectedFile.name.endsWith(".txt") || selectedFile.name.endsWith(".md")) ? (
                  <div className="absolute inset-0 w-full h-full overflow-auto p-4 text-sm text-foreground whitespace-pre-wrap">
                    {preview}
                  </div>
                ) : (
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                )
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">タップしてファイルを選択</span></p>
                  <p className="text-xs text-muted-foreground">画像またはテキストファイル（.txt, .md）</p>
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
            <p className="mt-4 text-xs text-center text-muted-foreground">
              紙の手順書の画像、またはテキストファイル（.txt, .md）をアップロードしてください。
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden border-2 border-border">
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Captured" className="w-full h-full object-contain" />
                  <button
                    onClick={handleRetake}
                    className="absolute top-2 right-2 bg-destructive active:opacity-90 text-destructive-foreground px-3 py-2 rounded text-sm font-medium touch-manipulation min-h-[36px]"
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
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={handleCapture}
                      disabled={isProcessing}
                      className="w-20 h-20 rounded-full bg-background border-4 border-border shadow-lg active:bg-muted transition-colors touch-manipulation"
                      style={{ minWidth: '80px', minHeight: '80px' }}
                    >
                      <div className="w-14 h-14 rounded-full bg-background mx-auto border-2 border-muted-foreground"></div>
                    </button>
                  </div>
                </>
              )}
            </div>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              手順書をカメラで撮影してください。
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-background border-t border-border space-y-3">
        {preview && (
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className={`
              w-full font-bold py-4 rounded-lg text-base shadow-lg transition-all touch-manipulation min-h-[48px]
              ${isProcessing
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-primary active:opacity-90 text-primary-foreground"
              }
            `}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                手順書解析中...
              </span>
            ) : (
              "読み込む"
            )}
          </button>
        )}
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">または</span>
          </div>
        </div>
        
        <button
          onClick={onUseSample}
          disabled={isProcessing}
          className={`
            w-full font-bold py-4 rounded-lg text-base shadow-lg transition-all touch-manipulation min-h-[48px]
            ${isProcessing
              ? "bg-muted text-muted-foreground cursor-not-allowed" 
              : "bg-secondary active:opacity-90 text-secondary-foreground"
            }
          `}
        >
          サンプル手順書を使用
        </button>
      </div>
    </div>
  );
};

