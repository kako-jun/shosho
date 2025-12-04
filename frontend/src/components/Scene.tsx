import { useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import { BookCover } from "./BookCover";
import { Wind } from "./Wind";
import type { Book } from "../data/mockBooks";
import { mockBooks } from "../data/mockBooks";

interface SceneProps {
  onSelectBook: (book: Book) => void;
}

// 本の初期配置を生成（重ならないように、広めに配置）
function generateBookPositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const minDistance = 1.0;
  const areaSize = 5; // 風で内側に寄るので広めに

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let x: number, z: number;

    do {
      x = (Math.random() - 0.5) * areaSize;
      z = (Math.random() - 0.5) * areaSize;
      attempts++;
    } while (
      attempts < 50 &&
      positions.some(
        ([px, , pz]) => Math.hypot(x - px, z - pz) < minDistance
      )
    );

    positions.push([x, 4 + i * 0.8, z]);
  }

  return positions;
}

export function Scene({ onSelectBook }: SceneProps) {
  const [dropKey, setDropKey] = useState(0);
  const [paused, setPaused] = useState(true);
  const [positions, setPositions] = useState(() =>
    generateBookPositions(mockBooks.length)
  );

  // 初回は少し遅延してから物理演算を開始
  useEffect(() => {
    setPaused(true);
    const timer = setTimeout(() => setPaused(false), 300);
    return () => clearTimeout(timer);
  }, [dropKey]);

  const handleRedrop = useCallback(() => {
    setPositions(generateBookPositions(mockBooks.length));
    setDropKey((k) => k + 1);
  }, []);

  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{
          position: [0, 10, 0.01],
          zoom: 120,
          near: 0.1,
          far: 100,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#1a1a2e"]} />

        {/* 照明 - 真上から均一に */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[0, 10, 0]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* 物理エンジン */}
        <Physics gravity={[0, -9.81, 0]} paused={paused} key={dropKey}>
          <Ground />
          <Wind />
          {mockBooks.map((book, index) => (
            <BookCover
              key={`${book.asin}-${dropKey}`}
              book={book}
              position={positions[index]}
              onSelect={onSelectBook}
            />
          ))}
        </Physics>
      </Canvas>

      {/* もう一回落とすボタン */}
      <button
        onClick={handleRedrop}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "12px 24px",
          fontSize: "14px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
      >
        もう一回落とす
      </button>
    </>
  );
}
