import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { Tile } from "./tile";

/**
 * Represents a Grid
 * @class Grid
 */
export class Grid {
  /**
   * @param {THREE.Scene} scene
   * @param {number} gridSize
   */
  constructor(scene, gridSize = 2) {
    this.scene = scene;
    this.gridSize = gridSize;
    this.tileSize = 3;
    this.position = { x: 0, z: 0 };
    this.tiles = [];

    this.createGrid();
  }

  /**
   * Create a grid of tiles
   * @method
   */
  createGrid() {
    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        const posX = (x - (this.gridSize - 1) / 2) * this.tileSize;
        const posZ = (z - (this.gridSize - 1) / 2) * this.tileSize;

        const tile = new Tile(this.scene, this.tileSize, posX, posZ);
        this.tiles.push(tile);
      }
    }
  }
}
