import { useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";

// フレームループを維持するためのダミーコンポーネント
function FrameLoop() {
  useFrame(() => {});
  return null;
}
import { Ground } from "./Ground";
import { BookCover } from "./BookCover";
import { Walls } from "./Walls";
import type { Book } from "../data/mockBooks";
import { mockBooks } from "../data/mockBooks";

interface SceneProps {
  onSelectBook: (book: Book) => void;
}

export function Scene({ onSelectBook }: SceneProps) {
  const [dropKey, setDropKey] = useState(0);

  const handleRedrop = useCallback(() => {
    setDropKey((k) => k + 1);
  }, []);

  return (
    <>
    <Canvas
      shadows
      frameloop="always"
      orthographic
      camera={{
        position: [0, 15, 0.01],
        zoom: 100,
        near: 0.1,
        far: 50,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#1a1a2e"]} />

      {/* 照明 */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 物理エンジン */}
      <Physics gravity={[0, -9.81, 0]} key={dropKey}>
        <Ground />
        <Walls debug />
        {mockBooks.map((book, index) => (
          <BookCover
            key={book.asin}
            book={book}
            position={[
              (Math.random() - 0.5) * 4,
              5 + index * 0.5,
              (Math.random() - 0.5) * 4,
            ]}
            onSelect={onSelectBook}
          />
        ))}
      </Physics>

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
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
      }}
    >
      もう一回落とす
    </button>
    </>
  );
}
