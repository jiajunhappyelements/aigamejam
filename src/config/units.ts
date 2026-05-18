import type { UnitKind, UnitSpec } from "../types";

export const UNIT_SPECS: Record<UnitKind, UnitSpec> = {
  slinger: {
    kind: "slinger",
    name: "弹弓兵",
    hp: 90,
    damage: 20,
    range: 44,
    speed: 78,
    texture: "unit-slinger",
    tint: 0xff6f48
  },
  archer: {
    kind: "archer",
    name: "弓箭手",
    hp: 70,
    damage: 18,
    range: 150,
    speed: 58,
    texture: "unit-archer",
    tint: 0x78d47d
  },
  mage: {
    kind: "mage",
    name: "冰法师",
    hp: 60,
    damage: 14,
    range: 128,
    speed: 48,
    texture: "unit-mage",
    tint: 0x76dfff
  }
};
