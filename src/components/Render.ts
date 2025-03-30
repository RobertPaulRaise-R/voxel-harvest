import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons";

export type RenderComponent = {
  mesh: THREE.Mesh;
  animations?: any;
};
