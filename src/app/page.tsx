"use client";

import React, { useState, useRef } from "react";
import { CameraView, CameraHandle } from "@/components/CameraView";
import { YoshiButton } from "@/components/YoshiButton";
import { StepIndicator } from "@/components/StepIndicator";
import { FeedbackDisplay } from "@/components/FeedbackDisplay";
import { ProcedureConfirmation } from "@/components/ProcedureConfirmation";
import { WorkLogSummary } from "@/components/WorkLogSummary";
import { ProcedureUpload } from "@/components/ProcedureUpload";
import { analyzeImage } from "@/app/actions/analyze";
import {
  parseProcedureImage,
  parseProcedureText,
} from "@/app/actions/parseProcedure";
import { MOCK_PROCEDURE } from "@/data/mockProcedure";
import { ValidationResult, WorkLog, Procedure } from "@/types";

type AppState = "upload" | "confirmation" | "working" | "completed";

export default function Home() {
  const cameraRef = useRef<CameraHandle>(null);

  // App State
  const [appState, setAppState] = useState<AppState>("upload");
  const [activeProcedure, setActiveProcedure] = useState<Procedure | null>(
    null
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false); // Generic processing (upload, analysis)
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentStep = activeProcedure
    ? activeProcedure.steps[currentStepIndex]
    : null;
  const totalSteps = activeProcedure ? activeProcedure.steps.length : 0;

  // TTS Function
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Cancel previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handlers
  const handleProcedureUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      // Check if it's a text file
      const isTextFile =
        file.type.startsWith("text/") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md");

      if (isTextFile) {
        // Read text file
        const reader = new FileReader();
        reader.onload = async () => {
          const textContent = reader.result as string;
          const procedure = await parseProcedureText(textContent);

          if (procedure) {
            setActiveProcedure(procedure);
            setAppState("confirmation");
            speak("手順書を読み込みました。内容を確認してください。");
          } else {
            alert("手順書の解析に失敗しました。");
          }
          setIsProcessing(false);
        };
        reader.onerror = () => {
          alert("ファイルの読み込みに失敗しました");
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } else {
        // Image file - convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = reader.result as string;
          const procedure = await parseProcedureImage(base64);

          if (procedure) {
            setActiveProcedure(procedure);
            setAppState("confirmation");
            speak("手順書を読み込みました。内容を確認してください。");
          } else {
            alert("手順書の解析に失敗しました。");
          }
          setIsProcessing(false);
        };
        reader.onerror = () => {
          alert("ファイルの読み込みに失敗しました");
          setIsProcessing(false);
        };
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("アップロードに失敗しました");
      setIsProcessing(false);
    }
  };

  const handleUseSample = () => {
    setActiveProcedure(MOCK_PROCEDURE);
    setAppState("confirmation");
    speak("サンプル手順書を読み込みました。内容を確認してください。");
  };

  const handleStartWork = () => {
    setAppState("working");
    speak("作業を開始します。安全第一でお願いします。");
  };

  const handleRestart = () => {
    setAppState("upload"); // Go back to upload screen
    setActiveProcedure(null);
    setCurrentStepIndex(0);
    setWorkLogs([]);
    setValidationResult(null);
    setShowFeedback(false);
  };

  const handleYoshi = async () => {
    if (isProcessing || showFeedback || !currentStep || !activeProcedure)
      return;

    const imageSrc = cameraRef.current?.capture();
    if (!imageSrc) {
      alert("カメラエラー: 画像を取得できませんでした");
      return;
    }

    setIsProcessing(true);

    // Identify next step ID if available
    const nextStepId =
      currentStepIndex + 1 < totalSteps
        ? activeProcedure.steps[currentStepIndex + 1].id
        : "completed";

    try {
      const result = await analyzeImage(imageSrc, currentStep, nextStepId);
      setValidationResult(result);
      setShowFeedback(true);
      setIsProcessing(false);

      // Log the result
      const newLog: WorkLog = {
        stepId: currentStep.id,
        stepTitle: currentStep.title,
        timestamp: new Date(),
        result: result,
        // imageSrc: imageSrc // Optionally save image
      };
      setWorkLogs((prev) => [...prev, newLog]);

      // TTS Feedback
      speak(result.message);

      // Handle flow based on result
      if (result.isOk) {
        setTimeout(() => {
          setShowFeedback(false);
          setValidationResult(null);

          if (result.nextStepId === "completed") {
            setAppState("completed");
            speak("全作業完了です。お疲れ様でした。");
          } else {
            setCurrentStepIndex((prev) => prev + 1);
          }
        }, 4000); // Show success message for 4s
      } else {
        setTimeout(() => {
          setShowFeedback(false);
          setValidationResult(null);
        }, 4000); // Show error message for 4s then retry
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      setIsProcessing(false);
      alert("判定中にエラーが発生しました");
    }
  };

  const handleDemoOk = () => {
    if (isProcessing || showFeedback || !currentStep || !activeProcedure)
      return;

    setIsProcessing(true);

    // Identify next step ID if available
    const nextStepId =
      currentStepIndex + 1 < totalSteps
        ? activeProcedure.steps[currentStepIndex + 1].id
        : "completed";

    // Create demo OK result
    const demoResult: ValidationResult = {
      isOk: true,
      message: `よし！${currentStep.title}、確認OK。${nextStepId === "completed" ? "全作業完了です。" : "次に進みます。"}`,
      nextStepId: nextStepId,
      reason: "デモモード",
    };

    setValidationResult(demoResult);
    setShowFeedback(true);
    setIsProcessing(false);

    // Log the result
    const newLog: WorkLog = {
      stepId: currentStep.id,
      stepTitle: currentStep.title,
      timestamp: new Date(),
      result: demoResult,
    };
    setWorkLogs((prev) => [...prev, newLog]);

    // TTS Feedback
    speak(demoResult.message);

    // Handle flow
    setTimeout(() => {
      setShowFeedback(false);
      setValidationResult(null);

      if (nextStepId === "completed") {
        setAppState("completed");
        speak("全作業完了です。お疲れ様でした。");
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }, 4000);
  };

  // View: Upload
  if (appState === "upload") {
    return (
      <ProcedureUpload
        onUpload={handleProcedureUpload}
        onUseSample={handleUseSample}
        isProcessing={isProcessing}
      />
    );
  }

  // View: Confirmation
  if (appState === "confirmation" && activeProcedure) {
    return (
      <ProcedureConfirmation
        procedure={activeProcedure}
        onStart={handleStartWork}
      />
    );
  }

  // View: Completed
  if (appState === "completed" && activeProcedure) {
    return (
      <WorkLogSummary
        logs={workLogs}
        procedure={activeProcedure}
        onRestart={handleRestart}
      />
    );
  }

  // View: Working (Camera)
  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Top: Step Info */}
      {currentStep && (
        <StepIndicator
          step={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />
      )}

      {/* Middle: Camera View */}
      <div className="relative flex-1">
        <CameraView ref={cameraRef} />
      </div>

      {/* Bottom: Action Area */}
      <div className="pb-safe absolute right-0 bottom-0 left-0 z-20 flex justify-center bg-gradient-to-t from-black/90 via-black/80 to-transparent p-6">
        <YoshiButton
          onClick={handleYoshi}
          loading={isProcessing}
          disabled={showFeedback}
        />
      </div>

      {/* Overlay: Feedback */}
      {showFeedback && (
        <FeedbackDisplay result={validationResult} isVisible={showFeedback} />
      )}

      {/* Demo OK Button (右下に小さく配置) */}
      {!showFeedback && (
        <button
          onClick={handleDemoOk}
          disabled={isProcessing}
          className="absolute right-4 bottom-20 z-30 touch-manipulation rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white shadow-lg transition-colors hover:bg-green-500 active:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="デモ用: 必ずOKを返す"
        >
          DEMO OK
        </button>
      )}
    </main>
  );
}
