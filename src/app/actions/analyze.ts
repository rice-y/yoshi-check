"use server";

import OpenAI from "openai";
import { Step, ValidationResult } from "@/types";

// Llama API Configuration
const client = new OpenAI({
  apiKey: process.env.LLAMA_API_KEY || "dummy_key",
  baseURL: process.env.LLAMA_API_BASE_URL || "",
});

export async function analyzeImage(
  imageBase64: string,
  currentStep: Step,
  nextStepId?: string
): Promise<ValidationResult> {
  console.log("Analyzing image for step:", currentStep.title);

  // Mock response if no API key is present (for development safety)
  if (!process.env.LLAMA_API_KEY) {
    console.warn("No LLAMA_API_KEY found. Returning mock OK response.");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
    return {
      isOk: true,
      message: "よし！バルブの確認、完了しました。次はポンプの起動です。",
      nextStepId: nextStepId,
    };
  }

  try {
    const prompt = `
あなたは製造現場の安全管理者です。
作業員が「よし！」と指差呼称をした瞬間の画像を解析し、作業が正しいか判定してください。

【現在の作業手順】
タイトル: ${currentStep.title}
説明: ${currentStep.description}
危険予知ポイント: ${currentStep.dangerPoints.join(", ")}
確認すべき対象: ${currentStep.expectedObject}

画像を見て、以下の項目を確認してください：
1. 作業員が正しい対象物（${currentStep.expectedObject}）を見ているか、指差しているか。
2. 危険な状態ではないか。

回答は必ず以下のJSON形式のみで返してください。Markdownのコードブロックは不要です。
{
  "isOk": boolean, // 手順通りならtrue, 間違いや危険があればfalse
  "message": string, // 作業員への音声フィードバック (短く、簡潔に。OKなら「よし！○○確認OK。次は〜」, NGなら「待ってください！○○が違います」など)
  "reason": string // 判定の理由
}
`;

    const response = await client.chat.completions.create({
      model: "Llama-4-Maverick-17B-128E-Instruct", // Or 90b, depending on availability
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64, // react-webcam returns data:image/jpeg;base64,...
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from Llama API");
    }

    // JSON parsing (handle potential markdown blocks if the model adds them)
    const cleanContent = content.replace(/```json\n?|```/g, "").trim();
    const result = JSON.parse(cleanContent) as ValidationResult;

    // Add nextStepId logic manually since the AI doesn't know the full flow context perfectly
    if (result.isOk) {
      result.nextStepId = nextStepId;
    }

    return result;
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return {
      isOk: false,
      message: "エラーが発生しました。もう一度確認してください。",
      reason: "System Error",
    };
  }
}
