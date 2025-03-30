import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons";

import { ECS } from "./ecs";
import { movementSystem } from "./systems/movementSystem";
import { renderSystem } from "./systems/renderSystem";
import { PlayerComponent } from "./components/Player";
import { RenderComponent } from "./components/Render";
import { PositionComponent } from "./components/Position";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / innerHeight,
  0.5,
  1000
);
camera.position.set(0, 10, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ECS SETUP
const ecs = new ECS();
ecs.addSystem(movementSystem(ecs));
ecs.addSystem(renderSystem(ecs));

const playerEntity = ecs.createEntity();
ecs.addComponent(playerEntity, "Position", {
  x: 0,
  y: 0,
  z: 0,
} as PositionComponent);
ecs.addComponent(playerEntity, "Player", { speed: 5 } as PlayerComponent);

// Player Model Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/models/player.glb",
  (gltf) => {
    const playerModel = gltf.scene;
    // playerModel.scale.set(1, 1, 1); // Scale as needed
    scene.add(playerModel);

    ecs.addComponent(playerEntity, "Render", {
      mesh: playerModel,
    } as unknown as RenderComponent);
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);
  const deltaTime = 0.016; // Assuming 60 FPS
  ecs.update(deltaTime);

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
