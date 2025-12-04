import { RigidBody } from "@react-three/rapier";

const BOUNDARY = 4;
const WALL_HEIGHT = 10;

export function Walls({ debug = false }: { debug?: boolean }) {
  return (
    <>
      {/* 前 */}
      <RigidBody type="fixed" position={[0, WALL_HEIGHT / 2, -BOUNDARY]}>
        <mesh visible={debug}>
          <boxGeometry args={[BOUNDARY * 2, WALL_HEIGHT, 0.1]} />
          <meshStandardMaterial color="#ff0000" opacity={0.3} transparent />
        </mesh>
      </RigidBody>
      {/* 後 */}
      <RigidBody type="fixed" position={[0, WALL_HEIGHT / 2, BOUNDARY]}>
        <mesh visible={debug}>
          <boxGeometry args={[BOUNDARY * 2, WALL_HEIGHT, 0.1]} />
          <meshStandardMaterial color="#00ff00" opacity={0.3} transparent />
        </mesh>
      </RigidBody>
      {/* 左 */}
      <RigidBody type="fixed" position={[-BOUNDARY, WALL_HEIGHT / 2, 0]}>
        <mesh visible={debug}>
          <boxGeometry args={[0.1, WALL_HEIGHT, BOUNDARY * 2]} />
          <meshStandardMaterial color="#0000ff" opacity={0.3} transparent />
        </mesh>
      </RigidBody>
      {/* 右 */}
      <RigidBody type="fixed" position={[BOUNDARY, WALL_HEIGHT / 2, 0]}>
        <mesh visible={debug}>
          <boxGeometry args={[0.1, WALL_HEIGHT, BOUNDARY * 2]} />
          <meshStandardMaterial color="#ffff00" opacity={0.3} transparent />
        </mesh>
      </RigidBody>
    </>
  );
}
