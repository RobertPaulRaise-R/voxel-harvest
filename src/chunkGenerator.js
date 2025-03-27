import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class ChunkGenerator {
  constructor(mapData, chunkSize = 4, tileSize = 10) {
    this.mapData = mapData;
    this.chunkSize = chunkSize;
    this.tileSize = 10;
    this.tiles = [];

    // Debug: Log map dimensions
    console.log("Map dimensions:", {
      height: this.mapData.length,
      width: this.mapData[0].length,
    });
  }

  preload() {
    return new Promise((resolve, reject) => {
      this.loader.load(
        "/models/dirt_tile.glb",
        (gltf) => {
          this.tileModel = gltf.scene;
          // Optionally, set a default scale or other properties
          this.tileModel.scale.set(1, 1, 1);
          resolve(this.tileModel);
        },
        undefined,
        (error) => {
          console.error("Error preloading tile model:", error);
          reject(error);
        }
      );
    });
  }

  generateAllChunks() {
    const chunks = [];
    const mapHeight = this.mapData.length;
    const mapWidth = this.mapData[0].length;

    // Adjust chunk calculation
    const chunksX = Math.ceil(mapWidth / this.chunkSize);
    const chunksY = Math.ceil(mapHeight / this.chunkSize);

    console.log("Chunk grid:", { chunksX, chunksY });

    for (let chunkY = 0; chunkY < chunksY; chunkY++) {
      for (let chunkX = 0; chunkX < chunksX; chunkX++) {
        const chunk = this.generateChunk(chunkX, chunkY);
        chunks.push(chunk);
      }
    }
    return chunks;
  }

  generateChunk(chunkX, chunkY) {
    const chunkGroup = new THREE.Group();

    // Calculate precise chunk boundaries
    const startX = chunkX * this.chunkSize;
    const startY = chunkY * this.chunkSize;
    const endX = Math.min(startX + this.chunkSize, this.mapData[0].length);
    const endY = Math.min(startY + this.chunkSize, this.mapData.length);

    console.log(`Chunk (${chunkX}, ${chunkY}) boundaries:`, {
      startX,
      startY,
      endX,
      endY,
    });

    let tileCount = 0;
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        // Ensure we're not exceeding map boundaries
        if (y < this.mapData.length && x < this.mapData[0].length) {
          const tileType = this.mapData[y][x];
          const tile = this.createTile(tileType);

          // Precise positioning within chunk
          tile.position.x = (x - startX) * this.tileSize;
          tile.position.z = (y - startY) * this.tileSize;
          tile.rotation.x = -Math.PI / 2;

          this.tiles.push(tile);
          chunkGroup.add(tile);
          tileCount++;
        }
      }
    }

    // Position the entire chunk
    chunkGroup.position.set(
      chunkX * this.chunkSize * this.tileSize,
      0,
      chunkY * this.chunkSize * this.tileSize
    );

    console.log(`Chunk (${chunkX}, ${chunkY}) created ${tileCount} tiles`);
    return chunkGroup;
  }

  createTile(tileType = 1) {
    const texture = new THREE.TextureLoader().load("/textures/grass.png");

    const geometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize);

    // Use different colors based on tile type
    const colors = {
      0: 0x808080, // Gray for empty/default
      1: 0x00ff00, // Green for normal tiles
      // Add more tile types as needed
    };

    const material = new THREE.MeshStandardMaterial({
      //   color: colors[tileType] || 0x00ff00,
      map: texture,
    });

    const tile = new THREE.Mesh(geometry, material);
    return tile;
  }
}
