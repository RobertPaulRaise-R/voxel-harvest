import * as THREE from "three";
import { Grid } from "./grid";
import { Player } from "./player";
import { Tree } from "./tree";

// Scece setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Adjust the camera to center the map
// camera.position.set(0, 40, );

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedTile = null;

// Create a Grid
const grid = new Grid(scene, 5);
const tiles = grid.tiles;

// const gridHelper = new THREE.AxesHelper(5);
// scene.add(gridHelper);

// Clock for delta time
const clock = new THREE.Clock();

// Create a tree
const tree = new Tree(scene);

// Create player
const player = new Player(scene, [tree]);
player.tiles = tiles;

// Add the player to the scene

// Add Lightings
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Thrid Persom Camera following the Player
function updateCamera() {
  if (!player.player) return;

  const offset = new THREE.Vector3(0, 5, -5); // Offset behind player

  // Rotate offset to match player's direction
  const rotatedOffset = offset
    .clone()
    .applyQuaternion(player.player.quaternion);

  // Desired camera position behind player
  const targetPosition = player.player.position.clone().add(rotatedOffset);

  // Smoothly move camera to target position
  camera.position.lerp(targetPosition, 0.1);

  // Make the camera look at the player
  camera.lookAt(player.player.position);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  player.update(delta);

  updateCamera();

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// // Setup Dat.GUI
// const gui = new GUI();
// const cameraOptions = {
//   left: -frustumSize * aspect,
//   right: frustumSize * aspect,
//   top: frustumSize,
//   bottom: -frustumSize,
//   near: 0.1,
//   far: 100,
//   posX: camera.position.x,
//   posY: camera.position.y,
//   posZ: camera.position.z,
//   lookAtX: 0,
//   lookAtY: 0,
//   lookAtZ: 0,
//   zoom: frustumSize,
// };

// // Adjust Frustum (Zoom Effect)
// gui.add(cameraOptions, "left", -100, 0).onChange(updateProjection);
// gui.add(cameraOptions, "right", 0, 100).onChange(updateProjection);
// gui.add(cameraOptions, "top", 0, 10).onChange(updateProjection);
// gui.add(cameraOptions, "bottom", -10, 0).onChange(updateProjection);
// gui.add(cameraOptions, "near", 0.1, 10).onChange(updateProjection);
// gui.add(cameraOptions, "far", 10, 200).onChange(updateProjection);

// function updateProjection() {
//   camera.left = cameraOptions.left;
//   camera.right = cameraOptions.right;
//   camera.top = cameraOptions.top;
//   camera.bottom = cameraOptions.bottom;
//   camera.near = cameraOptions.near;
//   camera.far = cameraOptions.far;
//   camera.updateProjectionMatrix();
// }

// // Camera Position
// gui
//   .add(cameraOptions, "posX", -10, 10)
//   .onChange((value) => (camera.position.x = value));
// gui
//   .add(cameraOptions, "posY", -10, 10)
//   .onChange((value) => (camera.position.y = value));
// gui
//   .add(cameraOptions, "posZ", -10, 10)
//   .onChange((value) => (camera.position.z = value));

// // Camera LookAt
// gui.add(cameraOptions, "lookAtX", -5, 5).onChange(updateLookAt);
// gui.add(cameraOptions, "lookAtY", -5, 5).onChange(updateLookAt);
// gui.add(cameraOptions, "lookAtZ", -5, 5).onChange(updateLookAt);

// function updateLookAt() {
//   camera.lookAt(
//     cameraOptions.lookAtX,
//     cameraOptions.lookAtY,
//     cameraOptions.lookAtZ
//   );
// }
