import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";
import { Ground } from "./Ground";
import { BookCover } from "./BookCover";
import type { Book } from "../data/mockBooks";
import { mockBooks } from "../data/mockBooks";

interface SceneProps {
  onSelectBook: (book: Book) => void;
}

export function Scene({ onSelectBook }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 10], fov: 50 }}
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
      <Physics gravity={[0, -9.81, 0]}>
        <Ground />
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

      {/* カメラ操作 */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
    </Canvas>
  );
}
