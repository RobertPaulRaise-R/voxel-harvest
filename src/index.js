import * as THREE from "three";
import { Map } from "./map";
import { Game } from "./game";

// Scece setup
const scene = new THREE.Scene();

// Camera setup
const aspect = window.innerWidth / window.innerHeight;
const d = 10;

const camera = new THREE.OrthographicCamera(
  -d * aspect,
  d * aspect,
  d,
  -d,
  1,
  1000
);

camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);
camera.rotation.order = "YXZ";
camera.rotation.x = -Math.PI / 4;
camera.rotation.y = -Math.atan(1 / Math.sqrt(2));

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a grid
const map = new Map(scene, 5, 1, 5);
const game = new Game(scene, camera, renderer, map);

// Add Lightings
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Camera Position
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
