import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import { Text, Plane } from "@react-three/drei";
import { DoubleSide } from "three";
import type { Book } from "../data/mockBooks";

// 磁石反発の設定
const REPEL_DISTANCE = 1.5; // この距離以内で反発
const REPEL_STRENGTH = 0.002;

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
  const depth = 0.02; // 薄くする（カード状に）

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const pos = rb.translation();
    const rotation = rb.rotation();

    // === 1. 表面維持トルク ===
    // クォータニオンから上向きベクトルを計算
    const upX = 2 * (rotation.x * rotation.y - rotation.w * rotation.z);
    const upY = 1 - 2 * (rotation.x * rotation.x + rotation.z * rotation.z);
    const upZ = 2 * (rotation.y * rotation.z + rotation.w * rotation.x);

    if (upY < 0.3) {
      const torqueStrength = 0.0015;
      rb.applyTorqueImpulse(
        { x: -upZ * torqueStrength, y: 0, z: upX * torqueStrength },
        true
      );
    }

    // 着地後の微調整
    const vel = rb.linvel();
    const speed = Math.hypot(vel.x, vel.y, vel.z);
    if (speed < 0.5 && upY < 0.95) {
      const gentleTorque = 0.0005;
      rb.applyTorqueImpulse(
        { x: -upZ * gentleTorque, y: 0, z: upX * gentleTorque },
        true
      );
    }

    // === 2. 磁石反発（他の本との距離を保つ） ===
    const myHandle = rb.handle;
    world.bodies.forEach((other) => {
      if (other.handle === myHandle || other.isFixed()) return;

      const otherPos = other.translation();
      const dx = pos.x - otherPos.x;
      const dz = pos.z - otherPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist < REPEL_DISTANCE && dist > 0.01) {
        // 距離に反比例する反発力
        const force = REPEL_STRENGTH * (1 - dist / REPEL_DISTANCE);
        const nx = dx / dist;
        const nz = dz / dist;

        rb.applyImpulse(
          { x: nx * force, y: 0, z: nz * force },
          true
        );
      }
    });
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      rotation={[
        0, // X軸回転なし（最初から表向き）
        Math.random() * Math.PI * 2, // Y軸は自由回転
        0, // Z軸回転なし
      ]}
      colliders="cuboid"
      restitution={0.1} // 跳ね返りを減らす
      friction={0.9}
      linearDamping={0.5} // 落ち着きやすく
      angularDamping={0.8} // 回転が止まりやすく
    >
      {/* 物理判定用の薄いボックス（透明） */}
      <mesh visible={false}>
        <boxGeometry args={[width, depth, height]} />
      </mesh>

      {/* 表面のみのPlane（裏面なし） */}
      <Plane
        args={[width, height]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, depth / 2 + 0.001, 0]}
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
        <meshStandardMaterial color={book.color} side={DoubleSide} />
      </Plane>

      {/* 表紙にタイトルを表示 */}
      <Text
        position={[0, depth / 2 + 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.9}
      >
        {book.title}
      </Text>
      <Text
        position={[0, depth / 2 + 0.002, 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
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
