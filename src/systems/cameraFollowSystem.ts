import * as THREE from "three";
import { ECS } from "../ecs";
import { PositionComponent } from "../components/Position";

export function cameraFollowSystem(ecs: ECS, camera: THREE.Camera) {
  return () => {
    const playerEntity = ecs.findEntityWithComponent("Player");
    if (playerEntity === undefined) return;

    const playerPos = ecs.getComponent<PositionComponent>(
      playerEntity,
      "Position"
    );
    const renderComp = ecs.getComponent<{ mesh: THREE.Object3D }>(
      playerEntity,
      "Render"
    );
    if (!playerPos || !renderComp) return;

    const playerMesh = renderComp.mesh;
    const direction = new THREE.Vector3();
    playerMesh.getWorldDirection(direction); // Get player's forward direction

    // Offset camera behind the player
    const distance = 10; // Distance behind
    const height = 5; // Slightly above
    const offset = direction.clone().multiplyScalar(-distance);

    const cameraPos = new THREE.Vector3(
      playerPos.x + offset.x,
      playerPos.y + height,
      playerPos.z + offset.z
    );

    camera.position.lerp(cameraPos, 0.1); // Smooth transition
    camera.lookAt(playerPos.x, playerPos.y + 2, playerPos.z);
  };
}
