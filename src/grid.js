import * as THREE from "three";

export class Grid {
  constructor(scene, gridSize) {
    this.scene = scene;
    this.gridSize = gridSize;
    this.tileSize = 1;
    this.hoveredTile = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.createGrid();
    window.addEventListener("mousemove", (event) => this.onMouseMove(event));
  }

  createGrid() {
    const geometry = new THREE.BoxGeometry(this.tileSize, 0.5, this.tileSize);
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        attribute float isHovered;
        varying float vHover;
        void main() {
          vUv = uv;
          vHover = isHovered;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tileTexture;
        varying vec2 vUv;
        varying float vHover;

        void main() {
          vec4 texColor = texture2D(tileTexture, vUv);
          texColor.rgb += vec3(vHover * 0.5); // Apply hover effect smoothly
          gl_FragColor = texColor;
        }
      `,
      uniforms: {
        tileTexture: {
          value: new THREE.TextureLoader().load("textures/grass.png"),
        },
      },
    });

    this.gridMesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.gridSize * this.gridSize
    );
    this.gridMesh.instanceHover = new THREE.InstancedBufferAttribute(
      new Float32Array(this.gridSize * this.gridSize),
      1
    );

    let index = 0;
    const matrix = new THREE.Matrix4();
    const offset = (this.gridSize * this.tileSize) / 2; // Centering offset

    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        matrix.setPosition(x - offset, -0.25, z - offset);
        this.gridMesh.setMatrixAt(index, matrix);
        this.gridMesh.instanceHover.setX(index, 0);
        index++;
      }
    }

    // ✅ Set isHovered attribute AFTER the loop
    this.gridMesh.geometry.setAttribute(
      "isHovered",
      this.gridMesh.instanceHover
    );

    // ✅ Compute bounding sphere only once
    this.gridMesh.geometry.computeBoundingSphere();

    this.gridMesh.instanceMatrix.needsUpdate = true;
    this.gridMesh.instanceHover.needsUpdate = true;
    this.scene.add(this.gridMesh);
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  updateHover(camera) {
    this.raycaster.setFromCamera(this.mouse, camera);
    if (!this.gridMesh) return;

    const intersects = this.raycaster.intersectObject(this.gridMesh);
    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;

      if (this.hoveredTile !== null && this.hoveredTile !== instanceId) {
        this.gridMesh.instanceHover.setX(this.hoveredTile, 0);
      }

      this.gridMesh.instanceHover.setX(instanceId, 1);
      this.gridMesh.instanceHover.needsUpdate = true;
      this.gridMesh.geometry.attributes.isHovered.needsUpdate = true;

      this.hoveredTile = instanceId;
    } else if (this.hoveredTile !== null) {
      this.gridMesh.instanceHover.setX(this.hoveredTile, 0);
      this.gridMesh.instanceHover.needsUpdate = true;
      this.gridMesh.geometry.attributes.isHovered.needsUpdate = true;
      this.hoveredTile = null;
    }
  }
}
