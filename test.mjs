import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
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

let mixer;

gltfLoader.load("/models/player.glb", (gltf) => {
  const player = gltf.scene;
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(player);
  console.log(gltf.animations);

  const action = mixer.clipAction(gltf.animations[4]);
  action.play();

  const rightHand = player.getObjectByName("LowerArmR");
  if (rightHand) {
    gltfLoader.load("/models/shovel.glb", (gltf) => {
      const shovel = gltf.scene;

      rightHand.add(shovel);

      shovel.scale.set(0.03, 0.03, 0.03);
      shovel.position.set(0.0001, 0.006, -0.0003);
    });
  }
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

const clock = new THREE.Clock();
// Animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta); // Update animations

  renderer.render(scene, camera);
}
animate();

// Window resize event
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
