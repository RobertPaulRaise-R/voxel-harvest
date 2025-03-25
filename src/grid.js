import { mapData } from "./gameMap";
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
  constructor(scene) {
    this.scene = scene;
    this.row = mapData.length;
    this.col = mapData[0].length;
    this.tileSize = 5;
    this.position = { x: 0, z: 0 };
    this.tiles = [];

    console.log(this.row, this.col);

    this.createGrid();
  }

  /**
   * Create a grid of tiles
   * @method
   */
  createGrid() {
    for (let x = 0; x < this.row; x++) {
      for (let z = 0; z < this.col; z++) {
        const posX = x * this.tileSize;
        const posZ = z * this.tileSize;

        const tile = new Tile(this.scene, this.tileSize, posX, posZ);
        this.tiles.push(tile);
      }
    }
  }
}
