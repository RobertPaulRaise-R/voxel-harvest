import * as THREE from "three";

import { ECS } from "./ecs";
import { movementSystem } from "./systems/movementSystem";
import { renderSystem } from "./systems/renderSystem";
import { chunkSystem } from "./systems/chunkSystem";
import { createHighlightSystem } from "./systems/tileHighlightSystem";
import { cameraFollowSystem } from "./systems/cameraFollowSystem";
import { createPlayer } from "./entities/createPlayer";
import { mapData } from "./constants/mapData";
import { Sky } from "three/examples/jsm/Addons";
import { tileRenderSystem } from "./systems/tileRenderingSystem";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);
camera.position.set(0, 30, 0);
camera.lookAt(0, 0, 0);
// camera.up.set(0, 0, -1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ECS SETUP
const ecs = new ECS();
ecs.addSystem(movementSystem(ecs));
ecs.addSystem(renderSystem(ecs));

// Creating Player Entity
const { playerEntity, mixer } = createPlayer(ecs, scene);

// Adding player following camera system
ecs.addSystem(cameraFollowSystem(ecs, camera));

// For testing
const geometry = new THREE.PlaneGeometry(10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
mesh.position.set(-10, 0, -10);
scene.add(mesh);

const chunkSystemInstance = chunkSystem(ecs, scene, mapData, 2, 4);
chunkSystemInstance.preloadChunks();

createHighlightSystem(scene, camera, renderer, chunkSystemInstance.chunkCache);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sky = new Sky();
sky.scale.setScalar(1000); // Make it large enough

scene.add(sky);

// Sky Uniforms for Adjusting Atmosphere
const skyUniforms = sky.material.uniforms;
skyUniforms["turbidity"].value = 10; // Haze
skyUniforms["rayleigh"].value = 3; // Blue sky intensity
skyUniforms["mieCoefficient"].value = 0.005;
skyUniforms["mieDirectionalG"].value = 0.8;

// Sun Position (Determines Time of Day)
const sun = new THREE.Vector3();
const phi = THREE.MathUtils.degToRad(-90); // Angle of elevation
const theta = THREE.MathUtils.degToRad(180); // Direction
sun.setFromSphericalCoords(1, phi, theta);

skyUniforms["sunPosition"].value.copy(sun);

// Add axes to scene
scene.add(new THREE.AxesHelper(10));

// Add grid helper
const grid = new THREE.GridHelper(200, 200);
scene.add(grid);

const FIXED_DELTA_TIME = 1 / 60;
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const deltaTime = clock.getDelta(); // Assuming 60 FPS

  ecs.update(FIXED_DELTA_TIME);

  if (mixer) {
    mixer.update(deltaTime);
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
