import { useState } from "react";
import { Scene } from "./components/Scene";
import { BookDetail } from "./components/BookDetail";
import type { Book } from "./data/mockBooks";
import "./index.css";

function App() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* ヘッダー */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 24px",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          zIndex: 100,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "normal" }}>
          書架空少年帰
          <span style={{ fontSize: "12px", marginLeft: "8px", color: "#888" }}>
            Shosho
          </span>
        </h1>
      </div>

      {/* 3Dシーン */}
      <Scene onSelectBook={setSelectedBook} />

      {/* 本の詳細 */}
      <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />

      {/* 操作説明 */}
      <div
        style={{
          position: "fixed",
          bottom: selectedBook ? 140 : 20,
          left: 20,
          color: "#666",
          fontSize: "12px",
          transition: "bottom 0.3s",
        }}
      >
        ドラッグで回転 / スクロールでズーム / 本をクリックで詳細
      </div>
    </div>
  );
}

export default App;
