export class ECS {
  entities: number = 0;
  components: Map<number, Map<string, any>> = new Map();
  systems: ((dt: number) => void)[] = [];

  createEntity(): number {
    const entity = this.entities++;
    this.components.set(entity, new Map());
    return entity;
  }

  addComponent<T>(entity: number, name: string, component: T) {
    if (!this.components.has(entity)) return;
    this.components.get(entity)?.set(name, component);
  }

  getComponent<T>(entity: number, name: string): T | undefined {
    return this.components.get(entity)?.get(name);
  }

  addSystem(system: (dt: number) => void) {
    this.systems.push(system);
  }

  update(dt: number) {
    this.systems.forEach((system) => system(dt));
  }
}
