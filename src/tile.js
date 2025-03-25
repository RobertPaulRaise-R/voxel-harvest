import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const loader = new THREE.TextureLoader();
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
    this.texture = loader.load("/textures/grass.png", () =>
      console.log("Loaded")
    );
    this.geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.tile = new THREE.Mesh(this.geometry, this.material);
    this.tile.rotation.x = -Math.PI / 2;
    this.tile.position.set(x, 0, z);

    this.scene.add(this.tile);
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
