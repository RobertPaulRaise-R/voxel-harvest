import { ECS } from "@/ecs";
import { PlayerComponent } from "@/components/Player";
import { PositionComponent } from "@/components/Position";
import { RenderComponent } from "@/components/Render";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons";
import { playerAnimationSystem } from "@/systems/playerAnimationSystem";

export function createPlayer(ecs: ECS, scene: THREE.Scene) {
  const playerEntity = ecs.createEntity();

  ecs.addComponent(playerEntity, "Position", {
    x: 0,
    y: 0,
    z: 0,
  } as PositionComponent);
  ecs.addComponent(playerEntity, "Player", { speed: 5 } as PlayerComponent);

  let mixer: THREE.AnimationMixer | null = null;

  // Player Model Loader
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    "/models/player.glb",
    (gltf) => {
      const playerModel = gltf.scene;
      playerModel.animations = gltf.animations;
      scene.add(playerModel);

      ecs.addComponent(playerEntity, "Render", {
        mesh: playerModel,
        animations: gltf.animations, // ✅ Attach animations manually
      } as unknown as RenderComponent);

      mixer = new THREE.AnimationMixer(playerModel);

      const idleAction = mixer.clipAction(gltf.animations[11]);
      idleAction.play();

      ecs.addSystem(playerAnimationSystem(ecs, mixer));
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  return { playerEntity, mixer };
}
