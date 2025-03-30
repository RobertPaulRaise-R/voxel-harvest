import * as THREE from "three";

export function createHighlightSystem(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  chunks: any
) {
  const TILE_SIZE = 5;
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
  });

  const highlightGeometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
  const highlightMesh = new THREE.Mesh(highlightGeometry, highlightMaterial);
  highlightMesh.rotation.x = -Math.PI / 2;
  highlightMesh.visible = false;
  scene.add(highlightMesh);

  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  function updateHighlight(event: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let found = false;

    for (const mesh of chunks.values()) {
      const intersects = raycaster.intersectObject(mesh);
      if (intersects.length > 0) {
        const instanceId = intersects[0].instanceId!;
        const matrix = new THREE.Matrix4();
        mesh.getMatrixAt(instanceId, matrix);
        const position = new THREE.Vector3();
        position.setFromMatrixPosition(matrix);

        highlightMesh.position.set(position.x, 0.01, position.z);
        highlightMesh.visible = true;
        found = true;
        break;
      }
    }

    if (!found) highlightMesh.visible = false;
  }

  renderer.domElement.addEventListener("mousemove", updateHighlight);
}
