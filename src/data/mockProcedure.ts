import { Procedure } from "@/types";

export const MOCK_PROCEDURE: Procedure = {
  id: "procedure-001",
  title: "冷却水循環ポンプ始動手順",
  steps: [
    {
      id: "step-1",
      title: "吸込バルブの確認",
      description:
        "冷却水ポンプ(P-101)の吸込バルブ(V-101)が「全開」であることを確認してください。",
      dangerPoints: ["バルブの固着による腰痛", "配管からの液漏れ"],
      expectedObject: "Valve V-101 Open",
    },
    {
      id: "step-2",
      title: "吐出バルブの閉止確認",
      description:
        "ポンプ吐出バルブ(V-102)が「全閉」であることを確認してください。",
      dangerPoints: ["操作間違いによる逆流"],
      expectedObject: "Valve V-102 Closed",
    },
    {
      id: "step-3",
      title: "ポンプ起動",
      description:
        "現場操作盤の起動ボタン(Green)を押してポンプを起動してください。",
      dangerPoints: ["回転体への巻き込まれ", "感電"],
      expectedObject: "Pump Start Button",
    },
    {
      id: "step-4",
      title: "圧力確認と吐出バルブ開放",
      description:
        "吐出圧力が規定値(0.5MPa)に上がったことを確認し、ゆっくりと吐出バルブ(V-102)を開放してください。",
      dangerPoints: ["急激な圧力変動によるウォーターハンマー"],
      expectedObject: "Pressure Gauge and Valve V-102",
    },
  ],
};
