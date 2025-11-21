export interface Step {
  id: string;
  title: string;
  description: string;
  dangerPoints: string[]; // 危険予知ポイント
  expectedObject?: string; // 期待される対象物 (例: "Valve A")
}

export interface Procedure {
  id: string;
  title: string;
  steps: Step[];
}

export interface ValidationResult {
  isOk: boolean;
  message: string; // 音声読み上げ用メッセージ
  nextStepId?: string; // OKの場合の次のステップID
  reason?: string; // NGの理由
}

export interface WorkLog {
  stepId: string;
  stepTitle: string;
  timestamp: Date;
  result: ValidationResult;
  imageSrc?: string; // 記録用に画像を保持する場合
}
