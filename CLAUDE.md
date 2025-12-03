# Shosho - 開発者向け仕様書

このファイルはClaude Codeおよび開発者向けの技術仕様をまとめたものです。

## プロジェクト概要

**書架空少年帰（Shosho）** - バーチャル書店体験サービス

### コンセプト

- Amazonの書籍購入利便性とリアル書店の探索の楽しさ（セレンディピティ）を融合
- 価格や在庫ではなく「表紙や偶然の出会い」で購買意欲を喚起
- Amazonアソシエイト（アフィリエイト）に特化した収益モデル
- 初期コンテンツは人気少年漫画に限定

## 技術スタック

| レイヤー | 技術 | 用途 |
|---|---|---|
| フロントエンド | React + Vite + TypeScript | UIフレームワーク |
| 3D描画 | Three.js + react-three-fiber | 3D空間表現 |
| 物理エンジン | @react-three/rapier | 本の落下シミュレーション |
| バックエンド | Cloudflare Workers + Hono | APIサーバー |
| データベース | Cloudflare D1 (SQLite) | 書籍データ保存 |
| データ取得 | Amazon PA-API | 書籍情報取得 |
| 定期実行 | Cloudflare Cron Triggers | 新刊追加・データ更新 |
| ホスティング | shosho.llll-ll.com | 本番環境 |

## ディレクトリ構成

```
shosho/
├── CLAUDE.md                    # 開発者向け仕様（このファイル）
├── README.md                    # ユーザー向け説明
├── docs/
│   └── SERVICE_SPEC.md          # 詳細サービス仕様書
├── frontend/                    # フロントエンドアプリ
│   ├── src/
│   │   ├── components/
│   │   │   ├── Scene.tsx        # 3Dシーン（Canvas + Physics）
│   │   │   ├── BookCover.tsx    # 物理で落ちる本の表紙
│   │   │   ├── BookDetail.tsx   # 選択時の詳細UI
│   │   │   └── Ground.tsx       # 床
│   │   ├── data/
│   │   │   └── mockBooks.ts     # モックデータ
│   │   ├── App.tsx              # メインコンポーネント
│   │   └── index.css
│   └── package.json
└── workers/                     # Cloudflare Workers
    ├── src/
    │   ├── index.ts             # Hono APIサーバー
    │   └── paapi.ts             # PA-APIクライアント（スタブ）
    ├── schema.sql               # D1スキーマ
    ├── wrangler.toml            # Workers設定
    └── package.json
```

## 開発コマンド

```bash
# フロントエンド開発
cd frontend
npm install
npm run dev          # http://localhost:5173

# バックエンド開発
cd workers
npm install
npm run dev          # http://localhost:8787

# ビルド
cd frontend && npm run build
cd workers && npm run deploy
```

## APIエンドポイント

| メソッド | パス | 用途 |
|---------|------|------|
| GET | `/api/books` | 全書籍取得 |
| GET | `/api/books/random?limit=10` | ランダム取得（落下場用） |
| GET | `/api/books/shelf/:shelfId` | 書架別取得 |
| GET | `/api/shelves` | 書架一覧 |

## データベース設計

### Booksテーブル

```sql
CREATE TABLE books (
    asin TEXT PRIMARY KEY,        -- Amazon Product ID（必須）
    title TEXT NOT NULL,          -- 書籍タイトル（必須）
    volume TEXT,                  -- シリーズ巻数
    author TEXT NOT NULL,         -- 作者名（必須）
    image_url TEXT NOT NULL,      -- 表紙画像URL（必須）
    shelf_id TEXT,                -- 書架カテゴリID（例: pirate）
    link_tag TEXT,                -- アフィリエイトリンク
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Shelvesテーブル

```sql
CREATE TABLE shelves (
    id TEXT PRIMARY KEY,          -- 書架ID（例: pirate, ninja）
    name TEXT NOT NULL,           -- 表示名（例: 伝説の海賊棚）
    description TEXT              -- 説明文
);
```

### データ運用ポリシー

- **削除しない**: 一度登録した本は原則削除しない
- **価格・在庫は保持しない**: PA-APIへの日次リクエストは不要
- **週次更新**: Cron Triggersで新刊ASINを検索・追加

## フロントエンド機能

### 1. ランダム落下場（実装済み）

- 物理エンジンで表紙が床に落下・散乱
- クリックで詳細表示
- 「Amazonで手に取る」ボタン

### 2. バーチャル書店空間（未実装）

- ローポリゴン/粗いテクスチャでノスタルジックな3D空間
- 自由移動不可、カテゴリ選択で自動移動
- 全ての本は表紙を正面に（背表紙データ不使用）

### 3. UI要素

- **アテンダント**: 画面左端に2D立ち絵、誘導・解説（未実装）
- **本の詳細**: タイトル・巻数・作者・表紙のみ（価格・在庫なし）
- **購入ボタン**: 「Amazonで手に取る」- トラッキングコード付きリンク

## 開発時の注意事項

1. **アフィリエイトリンク**: 必ずトラッキングIDを含める
2. **画像URL**: Amazonからの直接取得、キャッシュ禁止（規約準拠）
3. **スクレイピング禁止**: PA-APIのみ使用
4. **レスポンシブ対応**: モバイル/デスクトップ両対応

## デプロイ手順

```bash
# 1. D1データベース作成
cd workers
wrangler d1 create shosho-db
# 出力されたdatabase_idをwrangler.tomlに設定

# 2. スキーマ適用
npm run db:migrate:prod

# 3. Workers デプロイ
npm run deploy

# 4. フロントエンド ビルド＆デプロイ
cd ../frontend
npm run build
# distをCloudflare Pagesなどにデプロイ
```
