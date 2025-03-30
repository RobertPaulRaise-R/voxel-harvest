import { ECS } from "../ecs";
import { PositionComponent } from "../components/Position";
import { RenderComponent } from "../components/Render";

export function renderSystem(ecs: ECS) {
  return () => {
    for (let entity = 0; entity < 1000; entity++) {
      const position = ecs.getComponent<PositionComponent>(entity, "Position");
      const render = ecs.getComponent<RenderComponent>(entity, "Render");

      if (position && render) {
        render.mesh.position.set(position.x, position.y, position.z);
      }
    }
  };
}
