export class ECS {
  entities: number = 0;
  components: Map<number, Map<string, any>> = new Map();
  systems: ((dt: number) => void)[] = [];
  // Track reusable entity IDs for better memory management
  private reusableEntities: number[] = [];

  createEntity(): number {
    // Try to reuse old ID first
    if (this.reusableEntities.length > 0) {
      const entity = this.reusableEntities.pop()!;
      this.components.set(entity, new Map());
      return entity;
    }

    // Otherwise create new one
    const entity = this.entities++;
    this.components.set(entity, new Map());
    return entity;
  }

  removeEntity(entity: number): boolean {
    if (!this.components.has(entity)) {
      return false;
    }

    // Clean up all components
    this.components.get(entity)?.clear();
    this.components.delete(entity);

    // Add to reusable entities if it's not the most recent one
    if (entity < this.entities - 1) {
      this.reusableEntities.push(entity);
    } else {
      // If it's the most recent, we can just decrement our counter
      this.entities--;
    }

    return true;
  }

  findEntityWithComponent(name: string): number | null {
    for (const [entity, components] of this.components) {
      if (components.has(name)) {
        return entity;
      }
    }
    return null;
  }

  addComponent<T>(entity: number, name: string, component: T): boolean {
    if (!this.components.has(entity)) return false;
    this.components.get(entity)?.set(name, component);
    return true;
  }

  getComponent<T>(entity: number, name: string): T | undefined {
    return this.components.get(entity)?.get(name);
  }

  removeComponent(entity: number, name: string): boolean {
    if (!this.components.has(entity)) return false;
    return this.components.get(entity)?.delete(name) ?? false;
  }

  addSystem(system: (dt: number) => void) {
    this.systems.push(system);
  }

  update(dt: number) {
    this.systems.forEach((system) => system(dt));
  }

  // Optional: Bulk entity removal
  clearEntities() {
    this.components.clear();
    this.reusableEntities = [];
    this.entities = 0;
  }
}
