import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class Crop {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.crop = null;
    this.cropPhase = 0;

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.load(`/models/plant${this.cropPhase}.glb`, (gltf) => {
      this.crop = gltf.scene;

      this.scene.add(this.crop);
    });
  }

  nextPlantPhase() {
    this.cropPhase += 1;
  }
}
