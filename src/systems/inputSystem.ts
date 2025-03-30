const keys: Record<string, boolean> = {};

console.log(keys);
window.addEventListener("keydown", (event) => {
  console.log("Key Down:", event.code); // Debugging
  keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  console.log("Key Up:", event.code); // Debugging
  keys[event.code] = false;
});

export function getMovementInput() {
  return {
    forward: keys["KeyW"] || keys["ArrowUp"] || false,
    backward: keys["KeyS"] || keys["ArrowDown"] || false,
    left: keys["KeyA"] || keys["ArrowLeft"] || false,
    right: keys["KeyD"] || keys["ArrowRight"] || false,
  };
}
