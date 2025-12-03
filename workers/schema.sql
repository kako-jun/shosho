-- Shosho D1 Database Schema

CREATE TABLE IF NOT EXISTS books (
    asin TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    volume TEXT,
    author TEXT NOT NULL,
    image_url TEXT NOT NULL,
    shelf_id TEXT,
    link_tag TEXT,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 書架（カテゴリ）テーブル
CREATE TABLE IF NOT EXISTS shelves (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_books_shelf ON books(shelf_id);
CREATE INDEX IF NOT EXISTS idx_books_registered ON books(registered_at);

-- 初期データ: 書架カテゴリ
INSERT OR IGNORE INTO shelves (id, name, description) VALUES
    ('pirate', '伝説の海賊棚', '大海原を駆ける冒険譚'),
    ('ninja', '忍びの里棚', '忍術と友情の物語'),
    ('battle', '最強決定戦棚', 'バトルと成長の軌跡'),
    ('sports', '青春グラウンド棚', 'スポーツに賭ける熱い想い'),
    ('dark', '闘いの果て棚', 'ダークファンタジーの世界');
