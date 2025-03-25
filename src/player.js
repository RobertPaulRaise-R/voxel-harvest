import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class Player {
  constructor(scene, obstacles = [], grid) {
    this.scene = scene;
    this.grid = grid;
    this.mixer = null;
    this.obstacles = obstacles;
    this.keys = {};
    this.speed = 3;
    this.rotationSpeed = Math.PI / 2;
    this.currentAnimation = null;

    this.loader = new GLTFLoader();
    this.loader.load("/models/player.glb", (gltf) => {
      this.player = gltf.scene;
      this.player.position.set(0, 0, 0);
      this.scene.add(this.player);

      this.mixer = new THREE.AnimationMixer(this.player);
      this.animations = {};
      console.log(gltf.animations);
      gltf.animations.forEach((clip) => {
        this.animations[clip.name] = this.mixer.clipAction(clip);
      });
      this.playAnimation("Idle");
    });

    this.initKeyBoardControls();
  }

  initKeyBoardControls() {
    window.addEventListener("keydown", (event) => {
      this.keys[event.code] = true;
    });
    window.addEventListener("keyup", (event) => {
      this.keys[event.code] = false;
    });
  }

  playAnimation(animationName) {
    if (
      !this.animations[animationName] ||
      this.currentAnimation === animationName
    )
      return;
    this.currentAnimation = animationName;
    Object.values(this.animations).forEach((animation) =>
      animation.fadeOut(0.2)
    );
    this.animations[animationName].reset().fadeIn(0.2).play();
  }

  checkCollision(newPosition) {
    const playerBox = new THREE.Box3().setFromObject(this.player);
    return this.obstacles.some(
      (obj) => obj.boundingBox && playerBox.intersectsBox(obj.boundingBox)
    );
  }

  update(deltaTime) {
    if (!this.player || !this.mixer) return;

    let moving = false;
    const direction = new THREE.Vector3();

    if (this.keys["KeyW"] || this.keys["ArrowUp"]) {
      let speed = this.keys["Shift"] ? 2 : 1;
      direction.x += Math.sin(this.player.rotation.y) * speed;
      direction.z += Math.cos(this.player.rotation.y) * speed;
      moving = true;
    }
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) {
      direction.x -= Math.sin(this.player.rotation.y);
      direction.z -= Math.cos(this.player.rotation.y);
      moving = true;
    }
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) {
      this.player.rotation.y += this.rotationSpeed * deltaTime;
      moving = true;
    }
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) {
      this.player.rotation.y -= this.rotationSpeed * deltaTime;
      moving = true;
    }

    if (moving) {
      direction.normalize().multiplyScalar(this.speed * deltaTime);
      const newPosition = this.player.position.clone().add(direction);
      if (!this.checkCollision(newPosition)) {
        this.player.position.copy(newPosition);
      }
      if (this.keys["Shift"]) {
        this.playAnimation("Run");
      } else {
        this.playAnimation("Walk");
      }
    } else {
      this.playAnimation("Idle");
    }

    this.grid.updatePlayerPosition(
      this.player.position.x,
      this.player.position.z
    );
    // console.log(this.player.position);
    this.mixer.update(deltaTime);
  }
}
