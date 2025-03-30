import { ECS } from "@/ecs";
import { PositionComponent } from "@/components/Position";
import { PlayerComponent } from "@/components/Player";
import { getMovementInput } from "./inputSystem";
import * as THREE from "three";
import { RenderComponent } from "@/components/Render";

export function movementSystem(ecs: ECS) {
  return (dt: number) => {
    const input = getMovementInput();

    for (let entity = 0; entity < 1000; entity++) {
      const position = ecs.getComponent<PositionComponent>(entity, "Position");
      const player = ecs.getComponent<PlayerComponent>(entity, "Player");
      const renderComp = ecs.getComponent<RenderComponent>(entity, "Render");

      if (position && player && renderComp) {
        // Set walking speed by default
        player.speed = 5;

        // Increase speed if running (Shift + W)
        if (input.forward && input.running) {
          player.speed = 10; // Running speed
        } else if (!input.forward && !input.backward) {
          player.speed = 0; // Stop if no movement
        }

        const speed = player.speed * dt;

        // Get forward direction
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(renderComp.mesh.quaternion);

        // Move forward or backward
        if (input.forward) {
          position.x -= forward.x * speed;
          position.z -= forward.z * speed;
        }
        if (input.backward) {
          position.x += forward.x * speed;
          position.z += forward.z * speed;
        }

        // Rotate player left/right
        if (input.left) {
          renderComp.mesh.rotation.y += dt * 2;
        }
        if (input.right) {
          renderComp.mesh.rotation.y -= dt * 2;
        }

        // Apply position updates
        renderComp.mesh.position.set(position.x, position.y, position.z);
      }
    }
  };
}
