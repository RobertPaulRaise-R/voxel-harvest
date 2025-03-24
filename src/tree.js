import { Box3 } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class Tree {
  constructor(scene) {
    this.scene = scene;
    this.boundingBox = new Box3();

    this.loader = new GLTFLoader();
    this.loader.load("/models/tree.glb", (gltf) => {
      this.tree = gltf.scene;
      this.tree.position.set(3, 0, 0);

      this.tree.scale.set(0.01, 0.01, 0.01);
      this.scene.add(this.tree);

      this.boundingBox.setFromObject(this.tree);
    });
  }
}
