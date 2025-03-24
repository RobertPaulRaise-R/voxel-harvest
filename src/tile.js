import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * Represents a Tile
 * @class Tile
 */
export class Tile {
  /**
   * @param {THREE.Scene} scene
   * @param {number} tileSize
   * @param {number} x
   * @param {number} z
   * @param {string} tileType
   */
  constructor(scene, tileSize, x, z, tileType = "grass_tile2") {
    this.scene = scene;
    this.tileSize = tileSize;
    this.x = x;
    this.z = z;

    // Creating Tile
    this.tile = null;
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.load(
      `/models/${tileType}.glb`,
      (gltf) => {
        this.tile = gltf.scene;
        this.tile.position.set(x, 0, z);

        this.tile.scale.set(this.tileSize, this.tileSize / 2, this.tileSize);

        this.scene.add(gltf.scene);

        this.tile.userData.parentTile = this;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  }

  /**
   * Change the color of the tile when hovered
   * @method
   */
  onHover() {
    this.material.color.setHex(0x00ff00); // Green color
  }

  /**
   * Reset the color of the tile when not hovered
   * @method
   */
  onHoverOut() {
    this.material.color.setHex(0xffffff); //
  }

  /**
   * Log the position of the tile when clicked
   * @method
   */
  onClick() {
    console.log(`Tile at (${this.x}, ${this.z}) clicked`);
  }
}
