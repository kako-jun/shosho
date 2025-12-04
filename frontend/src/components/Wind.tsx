import { useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

// 視界の境界（この外側から風が吹く）
const BOUNDARY = 2.5;
const WIND_STRENGTH = 0.3;

export function Wind() {
  const { world } = useRapier();

  useFrame(() => {
    // 全ての剛体に対して風を適用
    world.bodies.forEach((body) => {
      if (body.isFixed()) return;

      const pos = body.translation();

      // 境界の外にいる場合、中央に向かって風を吹かせる
      let windX = 0;
      let windZ = 0;

      if (pos.x > BOUNDARY) {
        windX = -(pos.x - BOUNDARY) * WIND_STRENGTH;
      } else if (pos.x < -BOUNDARY) {
        windX = -(-BOUNDARY - pos.x) * -WIND_STRENGTH;
      }

      if (pos.z > BOUNDARY) {
        windZ = -(pos.z - BOUNDARY) * WIND_STRENGTH;
      } else if (pos.z < -BOUNDARY) {
        windZ = -(-BOUNDARY - pos.z) * -WIND_STRENGTH;
      }

      // 風の力を適用（Y方向には力を加えない＝裏返らない）
      if (windX !== 0 || windZ !== 0) {
        body.applyImpulse(
          { x: windX * 0.01, y: 0, z: windZ * 0.01 },
          true
        );
      }
    });
  });

  return null;
}
