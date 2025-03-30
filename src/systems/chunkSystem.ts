import * as THREE from "three";
import { ECS } from "../ecs";
import { mapData } from "../constants/mapData";
import { PositionComponent } from "@/components/Position";

const CHUNK_SIZE = 10;
const TILE_SIZE = 5;
const RENDER_DISTANCE = 2;

export function chunkSystem(
  ecs: ECS,
  scene: THREE.Scene,
  playerEntity: number
) {
  // Store chunks in ECS
  const chunks: Map<string, THREE.InstancedMesh> = new Map();
  ecs.addComponent(0, "Chunks", chunks); // ✅ Add to ECS (Entity 0 can be global storage)

  function getChunkKey(x: number, z: number) {
    return `${x},${z}`;
  }

  function createChunk(chunkX: number, chunkZ: number) {
    const geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
    geometry.rotateX(-Math.PI / 2);

    const texture = new THREE.TextureLoader().load("/textures/grass.png");
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      CHUNK_SIZE * CHUNK_SIZE
    );

    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);
    chunks.set(getChunkKey(chunkX, chunkZ), mesh);

    let i = 0;
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const mapX = chunkX * CHUNK_SIZE + x;
        const mapZ = chunkZ * CHUNK_SIZE + z;

        // ✅ Fix: Prevent out-of-bounds errors
        if (
          mapX < 0 ||
          mapX >= mapData.length ||
          mapZ < 0 ||
          mapZ >= mapData[0].length
        )
          continue;

        const tileType = mapData[mapX][mapZ];

        let tileColor = 0x00ff00; // Default green for grass
        if (tileType === 0) tileColor = 0x444444; // Walls
        if (tileType === 1) tileColor = 0x00aa00; // Grass
        if (tileType === 2) tileColor = 0xffff00; // Sand

        // mesh.setColorAt(i, new THREE.Color(tileColor));

        const matrix = new THREE.Matrix4();
        matrix.setPosition(mapX * TILE_SIZE, 0, mapZ * TILE_SIZE);
        mesh.setMatrixAt(i++, matrix);
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
  }

  return () => {
    const playerPos = ecs.getComponent<PositionComponent>(
      playerEntity,
      "Position"
    );
    if (!playerPos) return;

    const playerChunkX = Math.floor(playerPos.x / (CHUNK_SIZE * TILE_SIZE));
    const playerChunkZ = Math.floor(playerPos.z / (CHUNK_SIZE * TILE_SIZE));

    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        const chunkKey = getChunkKey(playerChunkX + dx, playerChunkZ + dz);
        if (!chunks.has(chunkKey)) {
          createChunk(playerChunkX + dx, playerChunkZ + dz);
        }
      }
    }
  };
}
