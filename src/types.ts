import Phaser from "phaser";

export type UnitKind = "slinger" | "archer" | "mage";
export type EnemyKind = "goblin" | "ogre";
export type Team = "ally" | "enemy";

export type Fighter = Phaser.GameObjects.Container & {
  kind: UnitKind | EnemyKind;
  team: Team;
  hp: number;
  maxHp: number;
  damage: number;
  range: number;
  speed: number;
  attackCd: number;
  attackTimer: number;
  launched?: boolean;
  slowUntil?: number;
  bounty?: number;
};

export type UnitSpec = {
  kind: UnitKind;
  name: string;
  hp: number;
  damage: number;
  range: number;
  speed: number;
  texture: string;
  tint: number;
};

export type EnemySpec = {
  kind: EnemyKind;
  hp: number;
  damage: number;
  range: number;
  speed: number;
  bounty: number;
  texture: string;
  scale: number;
};

export type SpriteSlice = {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Upgrade = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  apply: () => void;
};

export type GameState = {
  gold: number;
  castleHp: number;
  wave: number;
  waveTime: number;
  spawnTimer: number;
  allies: Fighter[];
  enemies: Fighter[];
  pending?: Fighter;
  dragging: boolean;
  modalOpen: boolean;
  summonBag: UnitKind[];
  summonCost: number;
  upgradeCost: number;
  unitDamageMultiplier: Record<UnitKind, number>;
  hpMultiplier: number;
  archerRangeMultiplier: number;
  mageFreezeMs: number;
  bountyMultiplier: number;
  launchImpactDamage: number;
};
