import * as THREE from "three";
import { ChunkGenerator } from "./chunkGenerator";

export class GameMap {
  constructor(mapData) {
    this.chunkGenerator = new ChunkGenerator(mapData, 4, 1);
    this.tiles = [];
  }

  initialize(scene) {
    const chunks = this.chunkGenerator.generateAllChunks();

    console.log(`Generated ${chunks.length} chunks`);

    chunks.forEach((chunk, index) => {
      console.log(`Chunk ${index} position:`, chunk.position);
      scene.add(chunk);
    });

    this.tiles = this.chunkGenerator.tiles;
    console.log(this.tiles);
  }
}
