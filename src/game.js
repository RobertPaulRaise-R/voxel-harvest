import { Grid } from "./grid";

export class Game {
  constructor(scene, camera, renderer, map) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.grid = new Grid(scene, 5);
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.grid.updateHover(this.camera);
    this.renderer.render(this.scene, this.camera);
  }
}
