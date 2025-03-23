// import * as THREE from "three";

// export class Tile {
//   static instanceMesh = null;
//   static count = 0;

//   tileHeight = 0.5;

//   constructor(scene, x, z, tileSize, texture = "grass") {
//     this.scene = scene;
//     this.x = x;
//     this.z = z;
//     this.tileSize = tileSize;
//     this.tileHeight = 0.5;
//     this.loader = new THREE.TextureLoader();

//     this.originalMaterial = null;
//     this.hoverTexture = null;

//     switch (texture) {
//       case "grass":
//         this.texture = this.loader.load("textures/grass.png");
//         break;
//       case "water":
//         this.texture = this.loader.load("textures/water.png");
//         break;
//       case "soil":
//         this.texture = this.loader.load("textures/soil.png");
//         break;
//       default:
//         this.texture = this.loader.load("textures/grass.png");
//     }

//     this.texture.wrapS = THREE.RepeatWrapping;
//     this.texture.wrapT = THREE.RepeatWrapping;
//     this.texture.repeat.set(1, 1);

//     if (!Tile.instanceMesh) {
//       const geometry = new THREE.BoxGeometry(
//         this.tileSize,
//         this.tileHeight,
//         this.tileSize
//       );
//       const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

//       Tile.instanceMesh = new THREE.InstancedMesh(geometry, material, 2500); // Max tiles
//       scene.add(Tile.instanceMesh);
//     }

//     this.index = Tile.count++;
//     const matrix = new THREE.Matrix4();
//     matrix.setPosition(x, -0.25, z);
//     Tile.instanceMesh.setMatrixAt(this.index, matrix);
//     Tile.instanceMesh.instanceMatrix.needsUpdate = true;

//     this.tile.position.set(this.x, -0.25, this.z);

//     this.originalMaterial = new THREE.MeshBasicMaterial({ map: this.texture });
//     this.hoverMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 });
//     this.tile.material = this.originalMaterial;

//     const edges = new THREE.EdgesGeometry(geometry);
//     const linesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
//     this.lines = new THREE.LineSegments(edges, linesMaterial);

//     this.tile.add(this.lines);

//     this.scene.add(this.tile);
//   }

//   setHover(isHovered) {
//     this.tile.material = isHovered ? this.hoverMaterial : this.originalMaterial;
//   }
// }

// import * as THREE from "three";

// export class Tile {
//   static instanceMesh = null;
//   static count = 0;
//   static tileSize = 1;
//   static tileHeight = 0.5;

//   constructor(scene, x, z, tileSize, texture) {
//     this.scene = scene;
//     this.x = x;
//     this.z = z;
//     this.tileSize = tileSize;

//     if (!Tile.instanceMesh) {
//       const geometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize);

//       const material = new THREE.ShaderMaterial({
//         vertexShader: `
//           varying vec2 vUv;
//           attribute float isHovered; // 0 or 1
//           varying float vHover;
//           void main() {
//             vUv = uv;
//             vHover = isHovered;
//             gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
//           }
//         `,
//         fragmentShader: `
//           uniform sampler2D tileTexture;
//           varying vec2 vUv;
//           varying float vHover;
//           void main() {
//             vec4 texColor = texture2D(tileTexture, vUv);
//             if (vHover > 0.5) {
//               texColor.rgb *= 1.5; // Brighten color on hover
//             }
//             gl_FragColor = texColor;
//           }
//         `,
//         uniforms: {
//           tileTexture: {
//             value: new THREE.TextureLoader().load("textures/grass.png"),
//           },
//         },
//       });

//       Tile.instanceMesh = new THREE.InstancedMesh(geometry, material, 2500);
//       Tile.instanceMesh.instanceHover = new THREE.InstancedBufferAttribute(
//         new Float32Array(2500), // 1 value per tile (0 = normal, 1 = hovered)
//         1
//       );

//       scene.add(Tile.instanceMesh);
//     }

//     Tile.instanceMesh.geometry.setAttribute(
//       "isHovered",
//       new THREE.InstancedBufferAttribute(new Float32Array(2500), 1)
//     );

//     this.index = Tile.count++;

//     const matrix = new THREE.Matrix4();
//     matrix.setPosition(x, -0.25, z);
//     Tile.instanceMesh.setMatrixAt(this.index, matrix);

//     // Set hover state to 0 (not hovered)
//     Tile.instanceMesh.instanceHover.setX(this.index, 0);
//     Tile.instanceMesh.instanceHover.needsUpdate = true;
//     Tile.instanceMesh.instanceMatrix.needsUpdate = true;
//   }

//   setHover(isHovered) {
//     this.tile.material = isHovered ? this.hoverMaterial : this.originalMaterial;
//   }
// }
