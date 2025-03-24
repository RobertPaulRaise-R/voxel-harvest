import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
export class Player {
  constructor(scene) {
    this.scene = scene;
    this.mixer = null;
    this.keys = {};
    this.speed = 3;
    this.rotationSpeed = Math.PI / 2;
    this.currentAnimation = null;

    this.loader = new GLTFLoader();
    this.loader.load("/models/player.glb", (gltf) => {
      this.player = gltf.scene;
      this.player.position.set(0, 0, 0);

      this.scene.add(gltf.scene);

      this.mixer = new THREE.AnimationMixer(this.player);
      this.animations = {};
      gltf.animations.forEach((clip) => {
        this.animations[clip.name] = this.mixer.clipAction(clip);
      });

      console.log("this.animations", this.animations);

      this.playAnimation("Idle");
    });

    this.initKeyBoardControls();
  }

  /**
   * Initialize the keyboard controls
   * @method
   */
  initKeyBoardControls() {
    window.addEventListener("keydown", (event) => {
      this.keys[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.code] = false;
    });
  }

  /**
   * Play an animation
   * @method
   * @param {string} animationName - The name of the animation to play
   */
  playAnimation(animationName) {
    if (!this.animations[animationName]) {
      console.error(`Animation ${animationName} not found`);
    }

    if (this.currentAnimation === animationName) return;

    this.currentAnimation = animationName;

    Object.values(this.animations).forEach((animation) => {
      animation.fadeOut(0.2);
    });

    this.animations[animationName].setEffectiveTimeScale(1);
    this.animations[animationName].reset().fadeIn(0.2).play();
  }

  /**
   * Update the player
   * @method
   * @param {number} deltaTime - The time between frames
   */
  update(deltaTime) {
    if (!this.player || !this.mixer) return;

    let moving = false;

    // Movement logic
    if (this.keys["KeyW"] || this.keys["ArrowUp"]) {
      this.player.position.x +=
        Math.sin(this.player.rotation.y) * this.speed * deltaTime;
      this.player.position.z +=
        Math.cos(this.player.rotation.y) * this.speed * deltaTime;
      moving = true;
    }
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) {
      if (!this.isRotated) {
        this.player.rotation.y += Math.PI; // Rotate 180 degrees
        this.isRotated = true; // Prevent multiple rotations
      }
      this.player.position.x +=
        Math.sin(this.player.rotation.y) * this.speed * deltaTime;
      this.player.position.z +=
        Math.cos(this.player.rotation.y) * this.speed * deltaTime;
      moving = true;
    } else {
      this.isRotated = false;
    }

    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) {
      this.player.rotation.y += this.rotationSpeed * deltaTime;
      moving = true;
    }
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) {
      this.player.rotation.y -= this.rotationSpeed * deltaTime;
      moving = true;
    }

    // Sync animation with movement
    if (moving) {
      this.playAnimation("Walk");
    } else {
      this.playAnimation("Idle");
    }

    // Update animation mixer
    this.mixer.update(deltaTime);
  }
}
