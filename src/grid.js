import { Vector3 } from "three";
import { mapData } from "./gameMap";
import { Tile } from "./tile";
import { TileHighliter } from "./tileHighlighter";

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
    this.player = { position: new Vector3(0, 0, 0) };
    this.highlighter = new TileHighliter(this.scene, this.tileSize);

    console.log(this.playerPosition);

    this.createGrid();
    this.scene.add(this.highlighter);
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

  updatePlayerPosition(newX, newZ) {
    this.playerPosition = { x: newX, z: newZ };

    // Check if the player is standing on a tile
    this.tiles.forEach((tile) => {
      if (
        Math.abs(tile.x - newX) < this.tileSize / 2 &&
        Math.abs(tile.z - newZ) < this.tileSize / 2
      ) {
        console.log(`${tile.x} ${tile.z}`);
        this.highlighter.updatePosition(tile.x, tile.z);
      }
    });
  }
}
