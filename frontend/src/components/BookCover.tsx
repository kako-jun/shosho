import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import type { Book } from "../data/mockBooks";

// 磁石反発の設定
const REPEL_DISTANCE = 1.5;
const REPEL_STRENGTH = 0.002;

// 壁からの反発
const WALL_BOUNDARY = 4;
const WALL_REPEL_DISTANCE = 1.0;
const WALL_REPEL_STRENGTH = 0.003;

interface BookCoverProps {
  book: Book;
  position: [number, number, number];
  onSelect: (book: Book) => void;
}

export function BookCover({ book, position, onSelect }: BookCoverProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { world } = useRapier();

  // 本の表紙サイズ（マンガ単行本の比率に近い）
  const width = 0.7;
  const height = 1;
  const depth = 0.05;

  // 磁石反発（他の本との距離を保つ）+ 壁からの反発
  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const pos = rb.translation();
    const myHandle = rb.handle;

    let forceX = 0;
    let forceZ = 0;

    // 他の本からの反発
    world.bodies.forEach((other) => {
      if (other.handle === myHandle || other.isFixed()) return;

      const otherPos = other.translation();
      const dx = pos.x - otherPos.x;
      const dz = pos.z - otherPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist < REPEL_DISTANCE && dist > 0.01) {
        const force = REPEL_STRENGTH * (1 - dist / REPEL_DISTANCE);
        const nx = dx / dist;
        const nz = dz / dist;

        forceX += nx * force;
        forceZ += nz * force;
      }
    });

    // 壁からの反発
    const distToRight = WALL_BOUNDARY - pos.x;
    const distToLeft = pos.x + WALL_BOUNDARY;
    const distToFront = WALL_BOUNDARY - pos.z;
    const distToBack = pos.z + WALL_BOUNDARY;

    if (distToRight < WALL_REPEL_DISTANCE) {
      forceX -= WALL_REPEL_STRENGTH * (1 - distToRight / WALL_REPEL_DISTANCE);
    }
    if (distToLeft < WALL_REPEL_DISTANCE) {
      forceX += WALL_REPEL_STRENGTH * (1 - distToLeft / WALL_REPEL_DISTANCE);
    }
    if (distToFront < WALL_REPEL_DISTANCE) {
      forceZ -= WALL_REPEL_STRENGTH * (1 - distToFront / WALL_REPEL_DISTANCE);
    }
    if (distToBack < WALL_REPEL_DISTANCE) {
      forceZ += WALL_REPEL_STRENGTH * (1 - distToBack / WALL_REPEL_DISTANCE);
    }

    if (forceX !== 0 || forceZ !== 0) {
      rb.applyImpulse({ x: forceX, y: 0, z: forceZ }, true);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
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
