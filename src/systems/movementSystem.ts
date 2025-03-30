import { ECS } from "@/ecs";

import { PositionComponent } from "@/components/Position";
import { PlayerComponent } from "@/components/Player";
import { getMovementInput } from "./inputSystem";

export function movementSystem(ecs: ECS) {
  return (dt: number) => {
    const input = getMovementInput();

    for (let entity = 0; entity < 1000; entity++) {
      const position = ecs.getComponent<PositionComponent>(entity, "Position");
      const player = ecs.getComponent<PlayerComponent>(entity, "Player");

      if (position && player) {
        const speed = player.speed * dt;

        // console.log("Movement Input:", input);

        if (input.forward) position.z -= speed;
        if (input.backward) position.z += speed;
        if (input.left) position.x -= speed;
        if (input.right) position.x += speed;
      }
    }
  };
}
