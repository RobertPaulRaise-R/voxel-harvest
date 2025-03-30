import * as THREE from "three";

export type PlayerComponent = {
  speed: number;
  position: THREE.Vector3;
  direction: "left" | "right" | "forward" | "idle";
};
