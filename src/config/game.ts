import type { GameState } from "../types";

export const GAME_SIZE = {
  width: 540,
  height: 960
} as const;

export const LANES = {
  wallY: 788,
  summonY: 846,
  slingX: GAME_SIZE.width / 2,
  slingY: 826
} as const;

export const ECONOMY = {
  initialGold: 100,
  baseSummonCost: 10,
  baseUpgradeCost: 100,
  waveBonusGold: 40,
  upgradeCostMultiplier: 1.55
} as const;

export const CASTLE = {
  maxHp: 600
} as const;

export const WAVE = {
  firstSpawnDelayMs: 1400,
  baseSpawnDelayMs: 1650,
  minSpawnDelayMs: 620,
  spawnDelayStepMs: 70,
  waveDurationMs: 26000
} as const;

export function createInitialState(): GameState {
  return {
    gold: ECONOMY.initialGold,
    castleHp: CASTLE.maxHp,
    wave: 1,
    waveTime: 0,
    spawnTimer: WAVE.firstSpawnDelayMs,
    allies: [],
    enemies: [],
    dragging: false,
    modalOpen: false,
    summonBag: [],
    summonCost: ECONOMY.baseSummonCost,
    upgradeCost: ECONOMY.baseUpgradeCost,
    unitDamageMultiplier: { slinger: 1, archer: 1, mage: 1 },
    hpMultiplier: 1,
    archerRangeMultiplier: 1,
    mageFreezeMs: 1500,
    bountyMultiplier: 1,
    launchImpactDamage: 0
  };
}
