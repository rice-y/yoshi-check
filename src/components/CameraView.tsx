"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 720,
  height: 1280,
  facingMode: "environment", // Use rear camera on mobile
};

export interface CameraHandle {
  capture: () => string | null;
}

export const CameraView = forwardRef<CameraHandle>((_, ref) => {
  const webcamRef = useRef<Webcam>(null);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (webcamRef.current) {
        return webcamRef.current.getScreenshot();
      }
      return null;
    },
  }));

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="absolute top-0 left-0 h-full w-full object-cover"
        forceScreenshotSourceSize={true}
      />
      {/* Overlay for target guide */}
      <div className="pointer-events-none absolute inset-0 border-2 border-white/30">
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border-2 border-yellow-400/50"></div>
      </div>
    </div>
  );
});

CameraView.displayName = "CameraView";
