import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const loader = new THREE.TextureLoader();
/**
 * Represents a Tile
 * @class Tile
 */
export class Tile {
  /**
   * @param {THREE.Scene} scene
   * @param {number} tileSize
   * @param {number} x
   * @param {number} z
   * @param {string} tileType
   */
  constructor(scene, tileSize, x, z, texture = "grass") {
    this.scene = scene;
    this.tileSize = tileSize;
    this.x = x;
    this.z = z;

    // Creating Tile
    this.texture = loader.load(`/textures/${texture}.png`);
    this.geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.tile = new THREE.Mesh(this.geometry, this.material);
    this.tile.rotation.x = -Math.PI / 2;
    this.tile.position.set(x, 0, z);

    this.scene.add(this.tile);
  }
}
