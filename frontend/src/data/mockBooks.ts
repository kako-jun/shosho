export interface Book {
  asin: string;
  title: string;
  volume?: string;
  author: string;
  imageUrl: string;
  color: string; // プレースホルダー用の色
}

// モックデータ（実際はPA-APIから取得）
export const mockBooks: Book[] = [
  {
    asin: "B001",
    title: "ONE PIECE",
    volume: "1巻",
    author: "尾田栄一郎",
    imageUrl: "",
    color: "#e74c3c",
  },
  {
    asin: "B002",
    title: "NARUTO",
    volume: "1巻",
    author: "岸本斉史",
    imageUrl: "",
    color: "#f39c12",
  },
  {
    asin: "B003",
    title: "BLEACH",
    volume: "1巻",
    author: "久保帯人",
    imageUrl: "",
    color: "#3498db",
  },
  {
    asin: "B004",
    title: "鬼滅の刃",
    volume: "1巻",
    author: "吾峠呼世晴",
    imageUrl: "",
    color: "#2ecc71",
  },
  {
    asin: "B005",
    title: "呪術廻戦",
    volume: "1巻",
    author: "芥見下々",
    imageUrl: "",
    color: "#9b59b6",
  },
  {
    asin: "B006",
    title: "僕のヒーローアカデミア",
    volume: "1巻",
    author: "堀越耕平",
    imageUrl: "",
    color: "#1abc9c",
  },
  {
    asin: "B007",
    title: "ドラゴンボール",
    volume: "1巻",
    author: "鳥山明",
    imageUrl: "",
    color: "#e67e22",
  },
  {
    asin: "B008",
    title: "SLAM DUNK",
    volume: "1巻",
    author: "井上雄彦",
    imageUrl: "",
    color: "#c0392b",
  },
  {
    asin: "B009",
    title: "進撃の巨人",
    volume: "1巻",
    author: "諫山創",
    imageUrl: "",
    color: "#7f8c8d",
  },
  {
    asin: "B010",
    title: "チェンソーマン",
    volume: "1巻",
    author: "藤本タツキ",
    imageUrl: "",
    color: "#d35400",
  },
];
