import type { Book } from "../data/mockBooks";

interface BookDetailProps {
  book: Book | null;
  onClose: () => void;
}

export function BookDetail({ book, onClose }: BookDetailProps) {
  if (!book) return null;

  // アフィリエイトリンク（実際はトラッキングIDを含める）
  const amazonUrl = `https://www.amazon.co.jp/dp/${book.asin}?tag=YOUR_TRACKING_ID`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.9)",
        padding: "24px",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        zIndex: 1000,
      }}
    >
      {/* 表紙プレースホルダー */}
      <div
        style={{
          width: "80px",
          height: "120px",
          backgroundColor: book.color,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          textAlign: "center",
          padding: "8px",
          flexShrink: 0,
        }}
      >
        {book.title}
      </div>

      {/* 情報 */}
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>{book.title}</h2>
        <p style={{ margin: "4px 0", color: "#aaa", fontSize: "14px" }}>
          {book.volume}
        </p>
        <p style={{ margin: "4px 0", color: "#888", fontSize: "14px" }}>
          {book.author}
        </p>
      </div>

      {/* ボタン */}
      <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#f90",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Amazonで手に取る
        </a>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid #666",
            color: "#999",
            padding: "12px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
