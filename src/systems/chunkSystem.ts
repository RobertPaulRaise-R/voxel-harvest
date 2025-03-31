// import { ECS } from "@/ecs";
// import { createTileMesh } from "@/utils";
// import * as THREE from "three";

// export function chunkSystem(
//   ecs: ECS,
//   scene: THREE.Scene,
//   mapData: number[][],
//   chunkSize = 5, // Now represents NxN tiles per chunk
//   tileSize = 1
// ) {
//   const chunkCache = new Map<string, THREE.Group>();

//   // Calculate how many chunks we need based on map dimensions
//   const chunksX = Math.ceil(mapData[0].length / chunkSize);
//   const chunksZ = Math.ceil(mapData.length / chunkSize);

//   function loadChunk(chunkX: number, chunkZ: number) {
//     const key = `${chunkX}_${chunkZ}`;
//     if (chunkCache.has(key)) return;

//     const chunkGroup = new THREE.Group();
//     chunkGroup.name = `chunk_${key}`;

//     // Calculate the starting indices in mapData
//     const startX = chunkX * chunkSize;
//     const startZ = chunkZ * chunkSize;

//     // Process a chunkSize x chunkSize area of the map
//     for (let dz = 0; dz < chunkSize; dz++) {
//       const mapZ = startZ + dz;
//       if (mapZ >= mapData.length) continue; // Skip out of bounds

//       for (let dx = 0; dx < chunkSize; dx++) {
//         const mapX = startX + dx;
//         if (mapX >= mapData[mapZ].length) continue; // Skip out of bounds

//         const tileType = mapData[mapZ][mapX];
//         if (tileType === undefined) continue;

//         // Calculate local position within chunk
//         const localX = dx * tileSize;
//         const localZ = dz * tileSize;

//         // Create entity and components
//         const entity = ecs.createEntity();
//         ecs.addComponent(entity, "Position", {
//           x: localX,
//           y: 0,
//           z: localZ,
//         });

//         ecs.addComponent(entity, "Tile", {
//           tileType: getTileTypeName(tileType),
//           health: 100,
//           waterLevel: 0,
//           fertility: 1,
//         });

//         const mesh = createTileMesh(tileSize, tileType);
//         mesh.position.set(localX, 0, localZ);
//         chunkGroup.add(mesh);
//       }
//     }

//     // Position the entire chunk group in world space
//     chunkGroup.position.set(startX * tileSize, 0, startZ * tileSize);

//     scene.add(chunkGroup);
//     chunkCache.set(key, chunkGroup);
//   }

//   function preloadAllChunks() {
//     for (let z = 0; z < chunksZ; z++) {
//       for (let x = 0; x < chunksX; x++) {
//         loadChunk(x, z);
//       }
//     }
//   }

//   function getTileTypeName(tileType: number): string {
//     switch (tileType) {
//       case 1:
//         return "grass";
//       case 2:
//         return "dirt";
//       default:
//         return "sand";
//     }
//   }

//   return {
//     preloadAllChunks,
//     loadChunk,
//     chunkCache,
//     chunksX,
//     chunksZ,
//   };
// }

import { ECS } from "@/ecs";
import { createTileMesh } from "@/utils";
import * as THREE from "three";

export function chunkSystem(
  ecs: ECS,
  scene: THREE.Scene,
  mapData: number[][],
  chunkSize = 10,
  tileSize = 4,
  renderDistance = 3
) {
  const chunkCache = new Map<string, THREE.Group>();
  const activeChunks = new Set<string>();
  const tileEntities = new Map<string, number>();

  // Improved error handling for map data
  if (!mapData || mapData.length === 0 || mapData[0].length === 0) {
    throw new Error("Invalid map data provided to chunk system");
  }

  function preloadChunks() {
    for (let z = 0; z < mapData.length; z += chunkSize) {
      for (let x = 0; x < mapData[0].length; x += chunkSize) {
        loadChunk(Math.floor(x / chunkSize), Math.floor(z / chunkSize));
      }
    }
  }

  function loadChunk(chunkX: number, chunkZ: number) {
    const key = getChunkKey(chunkX, chunkZ);
    if (chunkCache.has(key)) {
      reactivateChunk(key);
      return;
    }

    const chunkGroup = new THREE.Group();
    chunkGroup.name = `chunk_${key}`;
    const meshes: THREE.Mesh[] = [];

    for (let dz = 0; dz < chunkSize; dz++) {
      const z = chunkZ * chunkSize + dz;
      if (z >= mapData.length) continue;

      for (let dx = 0; dx < chunkSize; dx++) {
        const x = chunkX * chunkSize + dx;
        if (x >= mapData[z].length) continue;

        // Robust bounds checking
        if (mapData[z] === undefined || mapData[z][x] === undefined) {
          console.warn(`Skipping tile at (${x}, ${z}) - Out of bounds`);
          continue;
        }

        const tileType = mapData[z][x];
        if (tileType === undefined || tileType === null) continue;

        const worldX = x * tileSize;
        const worldZ = z * tileSize;

        const entity = ecs.createEntity();
        const entityKey = `${x}_${z}`;

        ecs.addComponent(entity, "Position", {
          x: worldX,
          y: 0,
          z: worldZ,
        });

        ecs.addComponent(entity, "Tile", {
          tileType: getTileTypeName(tileType),
          health: 100,
          waterLevel: 0,
          fertility: 1,
        });

        const mesh = createTileMesh(tileSize, tileType);
        ecs.addComponent(entity, "Render", {
          mesh,
          renderable: true,
        });

        chunkGroup.add(mesh);
        meshes.push(mesh);
        tileEntities.set(entityKey, entity);
      }
    }

    scene.add(chunkGroup);
    chunkCache.set(key, chunkGroup);
    activeChunks.add(key);
  }

  function unloadChunk(chunkX: number, chunkZ: number) {
    const key = getChunkKey(chunkX, chunkZ);
    if (!chunkCache.has(key)) return;

    const chunk = chunkCache.get(key);
    scene.remove(chunk!);

    // Clean up entities for this chunk
    for (let dz = 0; dz < chunkSize; dz++) {
      const z = chunkZ * chunkSize + dz;
      if (z >= mapData.length) continue;

      for (let dx = 0; dx < chunkSize; dx++) {
        const x = chunkX * chunkSize + dx;
        const entityKey = `${x}_${z}`;

        if (tileEntities.has(entityKey)) {
          ecs.removeEntity(tileEntities.get(entityKey)!);
          tileEntities.delete(entityKey);
        }
      }
    }

    activeChunks.delete(key);
  }

  function reactivateChunk(key: string) {
    if (chunkCache.has(key) && !activeChunks.has(key)) {
      scene.add(chunkCache.get(key)!);
      activeChunks.add(key);
    }
  }

  function deactivateChunk(key: string) {
    if (chunkCache.has(key) && activeChunks.has(key)) {
      scene.remove(chunkCache.get(key)!);
      activeChunks.delete(key);
    }
  }

  function updateChunks(cameraPosition: THREE.Vector3) {
    const currentChunkX = Math.floor(cameraPosition.x / (chunkSize * tileSize));
    const currentChunkZ = Math.floor(cameraPosition.z / (chunkSize * tileSize));

    // Unload distant chunks
    Array.from(activeChunks).forEach((key) => {
      const [chunkX, chunkZ] = key.split("_").map(Number);
      const distance = Math.max(
        Math.abs(chunkX - currentChunkX),
        Math.abs(chunkZ - currentChunkZ)
      );

      if (distance > renderDistance) {
        deactivateChunk(key);
      }
    });

    // Load nearby chunks
    for (let z = -renderDistance; z <= renderDistance; z++) {
      for (let x = -renderDistance; x <= renderDistance; x++) {
        const chunkX = currentChunkX + x;
        const chunkZ = currentChunkZ + z;
        const key = getChunkKey(chunkX, chunkZ);

        if (!chunkCache.has(key)) {
          loadChunk(chunkX, chunkZ);
        } else if (!activeChunks.has(key)) {
          reactivateChunk(key);
        }
      }
    }
  }

  function getChunkKey(chunkX: number, chunkZ: number): string {
    return `${chunkX}_${chunkZ}`;
  }

  function getTileTypeName(tileType: number): string {
    switch (tileType) {
      case 1:
        return "grass";
      case 2:
        return "dirt";
      default:
        return "sand";
    }
  }

  function cleanup() {
    Array.from(chunkCache.keys()).forEach((key) => {
      const [chunkX, chunkZ] = key.split("_").map(Number);
      unloadChunk(chunkX, chunkZ);
    });
    chunkCache.clear();
    activeChunks.clear();
    tileEntities.clear();
  }

  return {
    preloadChunks,
    loadChunk,
    unloadChunk,
    updateChunks,
    cleanup,
    chunkCache,
    activeChunks,
  };
}
