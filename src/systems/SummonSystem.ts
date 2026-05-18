import Phaser from "phaser";
import { GAME_SIZE, LANES } from "../config/game";
import { UNIT_SPECS } from "../config/units";
import type { GameState, UnitKind } from "../types";
import { FighterFactory } from "../entities/FighterFactory";
import { Effects } from "./Effects";

export class SummonSystem {
  constructor(
    private readonly state: GameState,
    private readonly fighterFactory: FighterFactory,
    private readonly effects: Effects
  ) {}

  summonRandomUnit() {
    if (this.state.modalOpen) return;
    if (this.state.pending) {
      this.effects.floatText(GAME_SIZE.width / 2, LANES.summonY - 70, "先把当前士兵射出去", "#ffdf9a");
      return;
    }
    if (this.state.gold < this.state.summonCost) {
      this.effects.floatText(GAME_SIZE.width / 2, LANES.summonY - 70, "金币不足", "#ffb3a7");
      return;
    }
    this.state.gold -= this.state.summonCost;
    this.prepareUnit(this.drawUnitKind());
  }

  private drawUnitKind() {
    if (this.state.summonBag.length === 0) {
      this.state.summonBag = Phaser.Utils.Array.Shuffle<UnitKind>(["slinger", "archer", "mage"]);
    }
    return this.state.summonBag.pop() ?? "slinger";
  }

  private prepareUnit(kind: UnitKind) {
    const spec = UNIT_SPECS[kind];
    const unit = this.fighterFactory.create(LANES.slingX, LANES.summonY - 42, spec.texture, kind, "ally", spec);
    unit.setDepth(20);
    unit.launched = false;
    this.state.pending = unit;
    this.effects.floatText(LANES.slingX, LANES.summonY - 105, `${spec.name} 准备`, "#d8fbff");
  }
}
