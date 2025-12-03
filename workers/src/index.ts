import { Hono } from "hono";
import { cors } from "hono/cors";
import type { D1Database } from "@cloudflare/workers-types";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS設定
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://shosho.llll-ll.com"],
  })
);

// ヘルスチェック
app.get("/", (c) => {
  return c.json({ status: "ok", service: "shosho-api" });
});

// 全書籍取得
app.get("/api/books", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM books ORDER BY registered_at DESC"
    ).all();
    return c.json({ books: results });
  } catch {
    // D1未設定時はモックデータを返す
    return c.json({ books: getMockBooks() });
  }
});

// 書架別書籍取得
app.get("/api/books/shelf/:shelfId", async (c) => {
  const shelfId = c.req.param("shelfId");
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM books WHERE shelf_id = ? ORDER BY registered_at DESC"
    )
      .bind(shelfId)
      .all();
    return c.json({ books: results });
  } catch {
    const mockBooks = getMockBooks().filter((b) => b.shelf_id === shelfId);
    return c.json({ books: mockBooks });
  }
});

// ランダム書籍取得（落下場用）
app.get("/api/books/random", async (c) => {
  const limit = parseInt(c.req.query("limit") || "10");
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM books ORDER BY RANDOM() LIMIT ?"
    )
      .bind(limit)
      .all();
    return c.json({ books: results });
  } catch {
    const shuffled = getMockBooks().sort(() => Math.random() - 0.5);
    return c.json({ books: shuffled.slice(0, limit) });
  }
});

// 書架一覧取得
app.get("/api/shelves", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM shelves").all();
    return c.json({ shelves: results });
  } catch {
    return c.json({ shelves: getMockShelves() });
  }
});

// モックデータ（D1未設定時のフォールバック）
function getMockBooks() {
  return [
    {
      asin: "B00BPNNDXS",
      title: "ONE PIECE",
      volume: "1巻",
      author: "尾田栄一郎",
      image_url: "",
      shelf_id: "pirate",
      link_tag: null,
    },
    {
      asin: "B009GZLR2M",
      title: "NARUTO",
      volume: "1巻",
      author: "岸本斉史",
      image_url: "",
      shelf_id: "ninja",
      link_tag: null,
    },
    {
      asin: "B009KWT84C",
      title: "BLEACH",
      volume: "1巻",
      author: "久保帯人",
      image_url: "",
      shelf_id: "battle",
      link_tag: null,
    },
    {
      asin: "B07BHXL3PG",
      title: "鬼滅の刃",
      volume: "1巻",
      author: "吾峠呼世晴",
      image_url: "",
      shelf_id: "dark",
      link_tag: null,
    },
    {
      asin: "B07TXCM1MF",
      title: "呪術廻戦",
      volume: "1巻",
      author: "芥見下々",
      image_url: "",
      shelf_id: "dark",
      link_tag: null,
    },
    {
      asin: "B00BCEAM34",
      title: "僕のヒーローアカデミア",
      volume: "1巻",
      author: "堀越耕平",
      image_url: "",
      shelf_id: "battle",
      link_tag: null,
    },
    {
      asin: "B009GXQYC2",
      title: "ドラゴンボール",
      volume: "1巻",
      author: "鳥山明",
      image_url: "",
      shelf_id: "battle",
      link_tag: null,
    },
    {
      asin: "B009JZH4YY",
      title: "SLAM DUNK",
      volume: "1巻",
      author: "井上雄彦",
      image_url: "",
      shelf_id: "sports",
      link_tag: null,
    },
    {
      asin: "B00BOKQBSG",
      title: "進撃の巨人",
      volume: "1巻",
      author: "諫山創",
      image_url: "",
      shelf_id: "dark",
      link_tag: null,
    },
    {
      asin: "B08H56RQD2",
      title: "チェンソーマン",
      volume: "1巻",
      author: "藤本タツキ",
      image_url: "",
      shelf_id: "dark",
      link_tag: null,
    },
  ];
}

function getMockShelves() {
  return [
    { id: "pirate", name: "伝説の海賊棚", description: "大海原を駆ける冒険譚" },
    { id: "ninja", name: "忍びの里棚", description: "忍術と友情の物語" },
    { id: "battle", name: "最強決定戦棚", description: "バトルと成長の軌跡" },
    {
      id: "sports",
      name: "青春グラウンド棚",
      description: "スポーツに賭ける熱い想い",
    },
    {
      id: "dark",
      name: "闘いの果て棚",
      description: "ダークファンタジーの世界",
    },
  ];
}

export default app;
