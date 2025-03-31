import * as THREE from "three";

export type RenderComponent = {
  mesh: THREE.Mesh;
  animations?: any;
  renderable: boolean;
};
