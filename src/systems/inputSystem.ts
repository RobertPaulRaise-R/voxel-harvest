const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

export function getMovementInput() {
  return {
    forward: keys["KeyW"] || keys["ArrowUp"] || false,
    backward: keys["KeyS"] || keys["ArrowDown"] || false,
    left: keys["KeyA"] || keys["ArrowLeft"] || false,
    right: keys["KeyD"] || keys["ArrowRight"] || false,
    running: keys["ShiftLeft"] || keys["ShiftRight"] || false,
  };
}
