import * as THREE from "three";
import {
  GLTFLoader,
  OrbitControls,
  SimplifyModifier,
} from "three/examples/jsm/Addons.js";
import { Player } from "./src/player";

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

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// const player = new Player(scene);
function printBones(object) {
  object.traverse((child) => {
    if (child.isBone) {
      console.log(`Bone: ${child.name}`);
    }
  });
}

let mesh;

gltfLoader.load("/models/dirt_tile.glb", (gltf) => {
  mesh = gltf.scene;

  // Ensure the model has a mesh
  const originalMesh = mesh.children[0]; // Assuming the first child is the mesh
  if (!originalMesh) {
    console.error("No mesh found in the GLTF scene!");
    return;
  }

  // Apply simplification
  const modifier = new SimplifyModifier();
  const simplified = modifier.modify(originalMesh.geometry, 1);

  originalMesh.geometry = simplified; // Replace original geometry with the simplified one
  scene.add(mesh);
});

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

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
