"use server";

import OpenAI from "openai";
import { Procedure, Step } from "@/types";

// Llama API / OpenAI Configuration
const client = new OpenAI({
  apiKey: process.env.LLAMA_API_KEY || "dummy_key",
  baseURL: process.env.LLAMA_API_BASE_URL || "",
});

export async function parseProcedureImage(
  imageBase64: string
): Promise<Procedure | null> {
  console.log("Parsing procedure image...");

  try {
    const prompt = `
あなたは製造現場の安全管理者です。
アップロードされた作業手順書の画像を解析し、以下のJSON形式に変換してください。

【出力フォーマット】
{
  "title": string, // 手順書のタイトル
  "steps": [
    {
      "id": string, // "step-1", "step-2"...
      "title": string, // 各ステップのタイトル
      "description": string, // 作業内容の詳細説明
      "dangerPoints": string[], // 危険予知ポイント（画像や文脈から推測できるものも含めて）
      "expectedObject": string // このステップで確認すべき対象物（例: "Valve A", "Display Panel"）
    }
  ]
}

画像内の文字を正確に読み取り、作業手順を構造化してください。
危険ポイント(dangerPoints)が明記されていない場合は、作業内容から想定される一般的な危険（「感電」「高温」「挟まれ」など）を推測して追加してください。
JSONのみを返してください。Markdownのコードブロックは不要です。
`;

    const response = await client.chat.completions.create({
      model: "Llama-4-Maverick-17B-128E-Instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from Llama API");
    }

    const cleanContent = content.replace(/```json\n?|```/g, "").trim();
    const parsedData = JSON.parse(cleanContent);

    // Ensure ID generation if missing
    const procedure: Procedure = {
      id: `procedure-${Date.now()}`,
      title: parsedData.title || "名称未設定の手順書",
      steps: parsedData.steps.map((s: Step, i: number) => ({
        id: s.id || `step-${i + 1}`,
        title: s.title || `Step ${i + 1}`,
        description: s.description || "",
        dangerPoints: Array.isArray(s.dangerPoints) ? s.dangerPoints : [],
        expectedObject: s.expectedObject || "Target Object",
      })),
    };

    return procedure;
  } catch (error) {
    console.error("Procedure parsing failed:", error);
    return null;
  }
}

export async function parseProcedureText(
  textContent: string
): Promise<Procedure | null> {
  console.log("Parsing procedure text...");

  // Mock response if no API key
  if (!process.env.LLAMA_API_KEY) {
    console.warn("No LLAMA_API_KEY found. Returning mock procedure.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      id: `procedure-${Date.now()}`,
      title: "アップロードされた手順書（デモ）",
      steps: [
        {
          id: "step-1",
          title: "電源の確認",
          description:
            "主電源スイッチがOFFになっていることを確認してください。",
          dangerPoints: ["感電の危険"],
          expectedObject: "Power Switch OFF",
        },
        {
          id: "step-2",
          title: "カバーの取り外し",
          description: "4本のネジを緩めて保護カバーを取り外してください。",
          dangerPoints: ["指の挟み込み", "カバーの落下"],
          expectedObject: "Screws and Cover",
        },
      ],
    };
  }

  try {
    const prompt = `
あなたは製造現場の安全管理者です。
以下の作業手順書のテキストを解析し、以下のJSON形式に変換してください。

【入力テキスト】
${textContent}

【出力フォーマット】
{
  "title": string, // 手順書のタイトル
  "steps": [
    {
      "id": string, // "step-1", "step-2"...
      "title": string, // 各ステップのタイトル
      "description": string, // 作業内容の詳細説明
      "dangerPoints": string[], // 危険予知ポイント（明記されていない場合は作業内容から推測）
      "expectedObject": string // このステップで確認すべき対象物（例: "Valve A", "Display Panel"）
    }
  ]
}

テキスト内の作業手順を正確に読み取り、構造化してください。
危険ポイント(dangerPoints)が明記されていない場合は、作業内容から想定される一般的な危険（「感電」「高温」「挟まれ」など）を推測して追加してください。
JSONのみを返してください。Markdownのコードブロックは不要です。
`;

    const response = await client.chat.completions.create({
      model: "Llama-4-Maverick-17B-128E-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from Llama API");
    }

    const cleanContent = content.replace(/```json\n?|```/g, "").trim();
    const parsedData = JSON.parse(cleanContent);

    // Ensure ID generation if missing
    const procedure: Procedure = {
      id: `procedure-${Date.now()}`,
      title: parsedData.title || "名称未設定の手順書",
      steps: parsedData.steps.map((s: Step, i: number) => ({
        id: s.id || `step-${i + 1}`,
        title: s.title || `Step ${i + 1}`,
        description: s.description || "",
        dangerPoints: Array.isArray(s.dangerPoints) ? s.dangerPoints : [],
        expectedObject: s.expectedObject || "Target Object",
      })),
    };

    return procedure;
  } catch (error) {
    console.error("Procedure text parsing failed:", error);
    return null;
  }
}
