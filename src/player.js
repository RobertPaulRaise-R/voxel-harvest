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
      gltf.animations.forEach((clip) => {
        this.animations[clip.name] = this.mixer.clipAction(clip);
      });

      const rightHand = this.player.getObjectByName("LowerArmR");
      console.log(rightHand);
      if (rightHand) {
        this.loader.load("/models/shovel.glb", (gltf) => {
          const shovel = gltf.scene;

          rightHand.add(shovel);

          shovel.scale.set(0.03, 0.03, 0.03);
          shovel.position.set(0.0001, 0.006, -0.0003);
        });
      }

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

  isMoving() {
    return (
      this.keys["KeyW"] ||
      this.keys["ArrowUp"] ||
      this.keys["KeyS"] ||
      this.keys["ArrowDown"] ||
      this.keys["KeyA"] ||
      this.keys["ArrowLeft"] ||
      this.keys["KeyD"] ||
      this.keys["ArrowRight"]
    );
  }

  playAnimation(animationName) {
    if (!this.animations[animationName]) return;

    if (this.currentAnimation === animationName) return;
    this.currentAnimation = animationName;

    // Stop all other animations
    Object.values(this.animations).forEach((animation) =>
      animation.fadeOut(0.2)
    );

    const action = this.animations[animationName];

    if (animationName === "PickUp") {
      action.reset();
      action.setLoop(THREE.LoopOnce); // Play once
      action.clampWhenFinished = true; // Hold last frame
      action.play();

      // Remove any previous listeners to avoid duplicates
      this.mixer.removeEventListener("finished");

      this.mixer.addEventListener("finished", (e) => {
        if (e.action === action) {
          this.playAnimation(this.isMoving() ? "Walk" : "Idle");
        }
      });
    } else {
      action.reset().fadeIn(0.2).play();
    }
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
    let running = false;
    const direction = new THREE.Vector3();

    let speed = 1; // Default walk speed

    if (this.keys["KeyW"] || this.keys["ArrowUp"]) {
      if (this.keys["ShiftLeft"] || this.keys["ShiftRight"]) {
        speed = 2; // Increase speed for running
        running = true;
      }

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

    // Prevent overriding "PickUp" animation while it's playing
    if (this.currentAnimation === "PickUp") {
      this.mixer.update(deltaTime);
      return;
    }

    if (this.keys["KeyE"]) {
      this.playAnimation("PickUp");
    } else if (running) {
      this.playAnimation("Run");
    } else if (moving) {
      this.playAnimation("Walk");
    } else {
      this.playAnimation("Idle");
    }

    if (moving) {
      direction.normalize().multiplyScalar(this.speed * speed * deltaTime); // Multiply speed correctly
      const newPosition = this.player.position.clone().add(direction);
      if (!this.checkCollision(newPosition)) {
        this.player.position.copy(newPosition);
      }
    }

    this.grid.updatePlayerPosition(
      this.player.position.x,
      this.player.position.z
    );
    this.mixer.update(deltaTime);
  }
}
