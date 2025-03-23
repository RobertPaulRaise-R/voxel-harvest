import { Grid } from "./grid";

export class Map {
  constructor(scene, gridSize, tileSize, mapSize) {
    this.scene = scene;
    this.gridSize = gridSize;
    this.tileSize = tileSize;
    this.mapSize = mapSize;
    this.grids = [];

    // Calculate the map size
    this.totalSize = this.gridSize * this.tileSize * this.mapSize;

    this.offsetX = -this.totalSize / 2;
    this.offsetZ = -this.totalSize / 2;

    this.createMap();
  }

  createMap() {
    for (let x = 0; x < this.mapSize; x++) {
      for (let z = 0; z < this.mapSize; z++) {
        const posX = this.offsetX + x * this.gridSize * this.tileSize;
        const posZ = this.offsetZ + z * this.gridSize * this.tileSize;

        this.grids.push(
          new Grid(this.scene, this.gridSize, this.tileSize, {
            x: posX,
            z: posZ,
          })
        );
      }
    }
  }
}
