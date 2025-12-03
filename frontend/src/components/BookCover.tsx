import { RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import type { Book } from "../data/mockBooks";

interface BookCoverProps {
  book: Book;
  position: [number, number, number];
  onSelect: (book: Book) => void;
}

export function BookCover({ book, position, onSelect }: BookCoverProps) {
  // 本の表紙サイズ（マンガ単行本の比率に近い）
  const width = 0.7;
  const height = 1;
  const depth = 0.05;

  return (
    <RigidBody
      position={position}
      rotation={[
        Math.random() * 0.5 - 0.25,
        Math.random() * Math.PI * 2,
        Math.random() * 0.5 - 0.25,
      ]}
      colliders="cuboid"
      restitution={0.2}
      friction={0.8}
    >
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(book);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={book.color} />
      </mesh>
      {/* 表紙にタイトルを表示 */}
      <Text
        position={[0, 0, depth / 2 + 0.001]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.9}
      >
        {book.title}
      </Text>
      <Text
        position={[0, -0.35, depth / 2 + 0.001]}
        fontSize={0.05}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {book.volume}
      </Text>
    </RigidBody>
  );
}
