import * as THREE from "three";
import { mapData } from "@/constants/mapData";
import { ECS } from "@/ecs";
import { createTileMesh } from "@/utils";

export function tileRenderSystem(
  ecs: ECS,
  scene: THREE.Scene,
  tileSize: number
) {
  for (let z = 0; z < mapData.length; z++) {
    for (let x = 0; x < mapData[0].length; x++) {
      const tileX = x * tileSize + tileSize / 2;
      const tileZ = z * tileSize + tileSize / 2;

      const tileType = mapData[z][x];

      const tile = createTileMesh(tileSize, tileType);
      tile.position.set(tileX, 0, tileZ);
      scene.add(tile);
    }
  }
}
