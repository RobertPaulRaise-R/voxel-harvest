import * as THREE from "three";
import { Grid } from "./grid";
import { Tile } from "./tile";
import { Player } from "./player";

// Scece setup
const scene = new THREE.Scene();

// Camera setup
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10; // Initial zoom level

const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect,
  frustumSize * aspect,
  frustumSize,
  -frustumSize,
  1,
  2000
);

// Adjust the camera to center the map
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedTile = null;

// Create a Grid
const grid = new Grid(scene, 7);
const tiles = grid.tiles;

// const gridHelper = new THREE.AxesHelper(5);
// scene.add(gridHelper);

// Clock for delta time
const clock = new THREE.Clock();

// Create a player object
const player = new Player(scene);

// Add the player to the scene
scene.add(player);

// Add Lightings
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

document.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(tiles.map((tile) => tile.tile));

  if (intersects.length > 0 && intersects[0].object.userData.parentTile) {
    const tile = intersects[0].object.userData.parentTile;

    if (intersectedTile !== tile) {
      if (intersectedTile) intersectedTile.onHoverOut();
      tile.onHover();
      intersectedTile = tile;
    }
  } else {
    if (intersectedTile) intersectedTile.onHoverOut();
    intersectedTile = null;
  }
});

document.addEventListener("click", (event) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(tiles.map((tile) => tile.tile));

  if (intersects.length > 0) {
    const tile = intersects[0].object.userData.parentTile;
    tile.onClick();
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  player.update(delta);

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
