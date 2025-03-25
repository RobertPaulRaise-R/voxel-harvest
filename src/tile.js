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
  constructor(scene, tileSize, x, z, texture = "grass", brightness = 1) {
    this.scene = scene;
    this.tileSize = tileSize;
    this.brightness = brightness;
    this.x = x;
    this.z = z;

    // Creating Tile
    this.texture = loader.load(`/textures/${texture}.png`);
    this.geometry = new THREE.PlaneGeometry(tileSize, tileSize);
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      color: new THREE.Color(brightness, brightness, brightness),
    });
    this.tile = new THREE.Mesh(this.geometry, this.material);
    this.tile.rotation.x = -Math.PI / 2;
    this.tile.position.set(x, 0, z);

    this.scene.add(this.tile);
  }

  updateTexture(texture) {
    let newTexture = loader.load(`/textures/${texture}.png`);

    this.material.map = newTexture;
    this.material.needsUpdate = true;
  }
}
