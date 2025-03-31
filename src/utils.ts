import * as THREE from "three";

function createTileMesh(tileSize: number, tileType: number): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(tileSize, tileSize); // Adjust size if needed
  const material = new THREE.MeshStandardMaterial({
    color: getTileColor(tileType),
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; // Rotate to lay flat

  return mesh;
}

function getTileColor(tileType: number): number {
  switch (tileType) {
    case 1:
      return 0x228b22; // Grass (Green)
    case 2:
      return 0x8b4513; // Dirt (Brown)
    default:
      return 0xd2b48c; // Sand (Tan)
  }
}

export { createTileMesh };
