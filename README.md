# YOSHIE - AI安全確認システム

YOSHIEは、AI技術と大阪のおばちゃんキャラクターを組み合わせた、作業現場の安全確認を支援するシステムです。伝統的な「指差喚呼（Yoshi - Point and Call）」の実践を、AIの力でサポートします。

## 📋 プロジェクト概要

YOSHIEは、単なる監視ツールではなく、作業者の安全を心から気にかけるAIコンパニオンとして機能します。一人で作業する環境でも、AIが安全手順の遵守を支援し、事故を未然に防ぎます。

### 主な特徴

- 🤖 **AIによる安全確認**: 画像解析とLLMを活用した手順遵守の検証
- 📸 **リアルタイムカメラ分析**: Webカメラを使用した作業状況の監視
- 📄 **SOP（標準作業手順書）対応**: 画像から手順書を読み込み、ステップごとに確認
- 🔊 **音声フィードバック**: 作業結果を音声で通知
- 📊 **作業ログ記録**: 各ステップの確認結果を記録・表示

## 🚀 技術スタック

### フロントエンド

- **Next.js 15**: React フレームワーク
- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: スタイリング
- **react-webcam**: カメラアクセス

### バックエンド・AI

- **OpenAI API**: 画像解析とLLM推論
- **Server Actions**: Next.jsのサーバーアクション

### 開発環境

- **Node.js**: ランタイム環境
- **ESLint**: コードリンティング

## 📦 セットアップ

### 必要な環境

- Node.js 20以上
- npm または yarn

### インストール手順

1. リポジトリをクローン

```bash
git clone <repository-url>
cd llamahack-team9
```

2. 依存関係をインストール

```bash
npm install
# または
yarn install
```

3. 環境変数を設定

```bash
cp env.example .env
```

`.env`ファイルを編集し、必要なAPIキーを設定してください：

```env
LLAMA_API_KEY=your_llama_api_key_here
LLAMA_API_BASE_URL=https://api.llama-api.com
```

4. 開発サーバーを起動

```bash
npm run dev
# または
yarn dev
```

5. ブラウザで `http://localhost:3000` を開く

## 🎯 使用方法

### 基本的なワークフロー

1. **SOPアップロード**
   - 標準作業手順書（SOP）の画像をアップロードするか、サンプル手順書を使用
   - AIが画像を解析し、手順を抽出

2. **手順確認**
   - 抽出された手順を確認し、作業を開始

3. **作業実行**
   - カメラが作業状況を監視
   - 各ステップで「Yoshi」ボタンを押して確認
   - AIが画像を解析し、手順遵守を検証

4. **フィードバック**
   - 検証結果が音声と視覚で表示
   - 問題がある場合は再確認を促す

5. **作業完了**
   - 全ステップ完了後、作業ログを確認

## 📁 プロジェクト構造

```
llamahack-team9/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── actions/           # Server Actions
│   │   │   ├── analyze.ts     # 画像解析処理
│   │   │   └── parseSop.ts    # SOP解析処理
│   │   ├── globals.css        # グローバルスタイル
│   │   ├── layout.tsx         # レイアウト
│   │   └── page.tsx           # メインページ
│   ├── components/            # Reactコンポーネント
│   │   ├── CameraView.tsx     # カメラビュー
│   │   ├── FeedbackDisplay.tsx # フィードバック表示
│   │   ├── SopConfirmation.tsx # SOP確認画面
│   │   ├── SopUpload.tsx      # SOPアップロード
│   │   ├── StepIndicator.tsx  # ステップインジケーター
│   │   ├── WorkLogSummary.tsx # 作業ログサマリー
│   │   └── YoshiButton.tsx   # Yoshiボタン
│   ├── data/
│   │   └── mockSop.ts         # モックSOPデータ
│   └── types/
│       └── index.ts           # TypeScript型定義
├── docs/                       # ドキュメント
│   ├── mission.md             # プロジェクトミッション
│   ├── roadmap.md             # ロードマップ
│   └── tech-stack.md          # 技術スタック詳細
├── agent-os/                   # Agent OS設定
│   └── standards/             # コーディング標準
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# リンティング
npm run lint
```

### コーディング標準

プロジェクトのコーディング標準は `agent-os/standards/` ディレクトリに記載されています。

- **グローバル**: `agent-os/standards/global/`
- **フロントエンド**: `agent-os/standards/frontend/`
- **バックエンド**: `agent-os/standards/backend/`
- **テスト**: `agent-os/standards/testing/`

## 📚 ドキュメント

詳細なドキュメントは `docs/` ディレクトリにあります：

- [ミッション](docs/mission.md): プロジェクトの目的とビジョン
- [ロードマップ](docs/roadmap.md): 開発計画
- [技術スタック](docs/tech-stack.md): 使用技術の詳細

## 🎨 主な機能

### SOP解析

- 画像から標準作業手順書を自動抽出
- ステップごとの構造化データへの変換

### リアルタイム安全確認

- カメラ映像のリアルタイム分析
- 手順遵守の自動検証
- 危険行為の検出と警告

### 音声フィードバック

- Web Speech APIを使用した音声読み上げ
- 日本語対応の自然な音声通知

### 作業ログ

- 各ステップの確認結果を記録
- 作業完了後のサマリー表示

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します。詳細は各ブランチの開発ガイドラインを参照してください。

## 📄 ライセンス

このプロジェクトはプライベートプロジェクトです。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**YOSHIE** - 安全第一、AIと共に 🛡️
