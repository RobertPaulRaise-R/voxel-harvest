import * as THREE from "three";

const loader = new THREE.TextureLoader();
const texture = loader.load(
  "/textures/grass.png",
  () => console.log("Texture loaded successfully"),
  undefined,
  (err) => console.error("Error loading texture:", err)
);

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
   */
  constructor(scene, tileSize, x, z) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.x = x;
    this.z = z;

    // Creating Tile
    this.geometry = new THREE.BoxGeometry(this.tileSize, 0.5, this.tileSize);
    this.material = new THREE.MeshBasicMaterial({ map: texture });
    this.tile = new THREE.Mesh(this.geometry, this.material);

    this.tile.userData.parentTile = this;
    // Creating edges
    const edges = new THREE.EdgesGeometry(this.geometry);
    const lines = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    this.tile.add(lines);

    // Setting position of the tile
    this.tile.position.set(x, 0, z);
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
