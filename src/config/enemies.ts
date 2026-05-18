import type { EnemyKind, EnemySpec } from "../types";

export const ENEMY_SPECS: Record<EnemyKind, EnemySpec> = {
  goblin: {
    kind: "goblin",
    hp: 55,
    damage: 8,
    range: 34,
    speed: 34,
    bounty: 18,
    texture: "enemy-goblin",
    scale: 0.18
  },
  ogre: {
    kind: "ogre",
    hp: 180,
    damage: 20,
    range: 44,
    speed: 20,
    bounty: 55,
    texture: "enemy-ogre",
    scale: 0.2
  }
};
