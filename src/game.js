import * as THREE from "three";
import { Tile } from "./tile";

export class Game {
  constructor(scene, camera, renderer, map) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.map = map;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedTile = null;
    this.hoveredTile = null;
    this.frameCount = 0;

    window.addEventListener("mousemove", (event) => this.onmousemove(event));
    this.animate();
  }

  onmousemove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (!Tile.instanceMesh) return;

    const intersects = this.raycaster.intersectObject(Tile.instanceMesh);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId; // Get the index of the tile that was hit
      console.log("Hovered instance ID:", instanceId);

      if (this.hoveredTile !== null && this.hoveredTile !== instanceId) {
        // Reset old hovered tile
        Tile.instanceMesh.geometry.attributes.isHovered.setX(
          this.hoveredTile,
          0
        );
        Tile.instanceMesh.geometry.attributes.isHovered.needsUpdate = true;
      }

      // Set new hovered tile
      Tile.instanceMesh.geometry.attributes.isHovered.setX(instanceId, 1);
      Tile.instanceMesh.geometry.attributes.isHovered.needsUpdate = true;

      this.hoveredTile = instanceId;
    } else if (this.hoveredTile !== null) {
      // If nothing is hovered, reset the previous tile
      Tile.instanceMesh.geometry.attributes.isHovered.setX(this.hoveredTile, 0);
      Tile.instanceMesh.geometry.attributes.isHovered.needsUpdate = true;
      this.hoveredTile = null;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
