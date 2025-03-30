import { ECS } from "../ecs";
import { PlayerComponent } from "../components/Player";
import { RenderComponent } from "../components/Render";
import * as THREE from "three";

export function playerAnimationSystem(
  ecs: ECS,
  mixer: THREE.AnimationMixer | null
) {
  let currentAction: THREE.AnimationAction | null = null;
  let animations: Record<string, THREE.AnimationClip> = {};

  return (dt: number) => {
    if (!mixer) return;

    const playerEntity = ecs.findEntityWithComponent("Player");
    if (playerEntity === null) return;

    const player = ecs.getComponent<PlayerComponent>(playerEntity, "Player");
    const renderComp = ecs.getComponent<RenderComponent>(
      playerEntity,
      "Render"
    );

    if (!player || !renderComp || !renderComp.mesh) return;

    if (
      Object.keys(animations).length === 0 &&
      renderComp.mesh.animations.length > 0
    ) {
      animations = renderComp.mesh.animations.reduce((acc, clip) => {
        acc[clip.name] = clip;
        return acc;
      }, {} as Record<string, THREE.AnimationClip>);
      console.log("✅ Animations stored:", Object.keys(animations));
    }

    let actionName = "Idle"; // Default animation
    if (player.speed > 0) actionName = "Walk";
    if (player.speed > 5) actionName = "Run";

    console.log("🔄 Requested Animation:", actionName);

    if (!animations[actionName]) {
      return;
    }

    const newAction = mixer.clipAction(animations[actionName]);

    if (currentAction !== newAction) {
      if (currentAction) currentAction.fadeOut(0.2);
      newAction.reset().fadeIn(0.2).play();
      currentAction = newAction;
    }

    // Handle Rotation
    if (player.direction === "left") {
      renderComp.mesh.rotation.y += dt * 2; // Rotate left
    } else if (player.direction === "right") {
      renderComp.mesh.rotation.y -= dt * 2; // Rotate right
    }

    mixer.update(dt);
  };
}
