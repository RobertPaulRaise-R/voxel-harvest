import * as THREE from "three";
import { Tile } from "./src/tile.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a tile
const geometry = new THREE.PlaneGeometry(10, 10);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide,
});
const tile2D = new THREE.Mesh(geometry, material);
tile2D.rotation.x = -Math.PI / 2; // Rotate to lay flat on the ground
tile2D.position.set(0, 0.03, 0);

scene.add(tile2D);

const tileTile = new Tile(scene, 10, 0, 0);

setTimeout(() => {
  if (tileTile.mesh && tileTile.mesh.geometry) {
    addBorder(scene, tileTile.mesh);
  } else {
    console.error("Tile mesh is not ready");
  }
}, 500); // Wait for tile to initialize (adjust delay if needed)

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

function addBorder(scene, tileMesh) {
  if (!tileMesh.geometry) {
    console.error("Tile geometry is undefined");
    return;
  }

  const edges = new THREE.EdgesGeometry(tileMesh.geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const border = new THREE.LineSegments(edges, lineMaterial);

  border.position.copy(tileMesh.position);
  border.rotation.copy(tileMesh.rotation);
  border.position.y += 0.01; // Lift it slightly to avoid z-fighting

  scene.add(border);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2; // Minimum zoom distance
controls.maxDistance = 50; // Maximum zoom distance
controls.target.set(0, 0, 0); // Focus on the tile

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
animate();

// Window resize event
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
