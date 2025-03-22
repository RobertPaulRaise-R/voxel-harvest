import { Tile } from "./tile";

export class Grid {
  constructor(scene, gridSize = 5, tileSize = 1, position = { x: 0, z: 0 }) {
    this.scene = scene;
    this.position = { x: position.x, z: position.z };
    this.gridSize = gridSize;
    this.tileSize = tileSize;
    this.tileHeight = 0.5;

    this.tiles = [];
    this.createGrid();
  }

  createGrid() {
    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        const posX = this.position.x + x * this.tileSize;
        const posZ = this.position.z + z * this.tileSize;

        const tile = new Tile(this.scene, posX, posZ, this.tileSize, "grass");
        this.tiles.push(tile);
      }
    }
  }
}
