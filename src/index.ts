import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons";

import { ECS } from "./ecs";
import { movementSystem } from "./systems/movementSystem";
import { renderSystem } from "./systems/renderSystem";
import { PlayerComponent } from "./components/Player";
import { RenderComponent } from "./components/Render";
import { PositionComponent } from "./components/Position";
import { chunkSystem } from "./systems/chunkSystem";
import { createHighlightSystem } from "./systems/tileHighlightSystem";
import { cameraFollowSystem } from "./systems/cameraFollowSystem";
import { playerAnimationSystem } from "./systems/playerAnimationSystem";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);
camera.position.set(-5, 10, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ECS SETUP
const ecs = new ECS();
ecs.addSystem(movementSystem(ecs));
ecs.addSystem(renderSystem(ecs));
ecs.addSystem(cameraFollowSystem(ecs, camera));

const playerEntity = ecs.createEntity();
ecs.addComponent(playerEntity, "Position", {
  x: 0,
  y: 0,
  z: 0,
} as PositionComponent);
ecs.addComponent(playerEntity, "Player", { speed: 5 } as PlayerComponent);

ecs.addSystem(chunkSystem(ecs, scene, playerEntity));

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

    gltf.animations.forEach((anim, index) => {
      console.log(`Animation ${index}:`, anim.name);
    });

    const idleAction = mixer.clipAction(gltf.animations[11]);
    idleAction.play();

    console.log("✅ Player Model Loaded, Adding Animation System");

    ecs.addSystem(playerAnimationSystem(ecs, mixer));
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

const chunks = ecs.getComponent(0, "Chunks") as Map<
  string,
  THREE.InstancedMesh
>; // Pass your existing chunk map
createHighlightSystem(scene, camera, renderer, chunks);

camera.lookAt(5, 0, 10);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const FIXED_DELTA_TIME = 1 / 60;
function animate() {
  requestAnimationFrame(animate);
  const deltaTime = clock.getDelta(); // Assuming 60 FPS

  ecs.update(FIXED_DELTA_TIME);

  if (mixer) {
    mixer.update(deltaTime);
  }

  renderer.render(scene, camera);
}

const clock = new THREE.Clock();
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
