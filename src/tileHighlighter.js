import * as THREE from "three";

export class TileHighliter {
  constructor(scene, tileSize) {
    this.scene = scene;
    this.geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
    });
    this.tileHighlighter = new THREE.Mesh(this.geometry, this.material);
    this.tileHighlighter.rotation.x = -Math.PI / 2;
    this.tileHighlighter.position.set(0, 0.02, 0);

    this.scene.add(this.tileHighlighter);
  }

  updatePosition(x, z) {
    this.tileHighlighter.position.set(x, 0.02, z);
  }
}
