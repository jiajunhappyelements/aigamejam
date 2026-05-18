import Phaser from "phaser";
import { ECONOMY } from "../config/game";
import type { GameState, Upgrade } from "../types";
import { Effects } from "./Effects";
import { UpgradeModal } from "../ui/UpgradeModal";

export class UpgradeSystem {
  constructor(
    private readonly state: GameState,
    private readonly effects: Effects,
    private readonly openModal: (upgrades: Upgrade[], onPick: (upgrade: Upgrade) => void) => void
  ) {}

  tryOpenUpgradeModal() {
    if (this.state.modalOpen) return;
    if (this.state.gold < this.state.upgradeCost) {
      this.effects.floatText(270, 776, "金币不足", "#ffb3a7");
      return;
    }
    this.state.gold -= this.state.upgradeCost;
    this.state.modalOpen = true;
    const options = Phaser.Utils.Array.Shuffle(this.createUpgradePool()).slice(0, UpgradeModal.optionCount);
    this.openModal(options, (upgrade) => this.applyUpgrade(upgrade));
  }

  private applyUpgrade(upgrade: Upgrade) {
    upgrade.apply();
    this.state.upgradeCost = Math.round(this.state.upgradeCost * ECONOMY.upgradeCostMultiplier);
    this.state.modalOpen = false;
    this.effects.floatText(270, 210, upgrade.title, "#fff0a8");
  }

  private createUpgradePool(): Upgrade[] {
    return [
      {
        id: "slinger_damage",
        title: "强力弹丸",
        desc: "弹弓兵伤害 +40%",
        icon: "unit-slinger",
        apply: () => {
          this.state.unitDamageMultiplier.slinger += 0.4;
          this.state.allies.filter((a) => a.kind === "slinger").forEach((a) => {
            a.damage *= 1.4;
          });
        }
      },
      {
        id: "archer_range",
        title: "鹰眼箭术",
        desc: "弓箭手射程 +30%",
        icon: "unit-archer",
        apply: () => {
          this.state.archerRangeMultiplier += 0.3;
          this.state.allies.filter((a) => a.kind === "archer").forEach((a) => {
            a.range *= 1.3;
          });
        }
      },
      {
        id: "mage_freeze",
        title: "寒霜禁锢",
        desc: "冰法减速时间 +1 秒",
        icon: "unit-mage",
        apply: () => {
          this.state.mageFreezeMs += 1000;
        }
      },
      {
        id: "all_hp",
        title: "坚韧护符",
        desc: "所有单位生命 +25%",
        icon: "wall",
        apply: () => {
          this.state.hpMultiplier += 0.25;
          this.state.allies.forEach((a) => {
            const gain = a.maxHp * 0.25;
            a.maxHp += gain;
            a.hp += gain;
          });
        }
      },
      {
        id: "cheap_summon",
        title: "征召令",
        desc: "召唤价格 -2",
        icon: "coin",
        apply: () => {
          this.state.summonCost = Math.max(4, this.state.summonCost - 2);
        }
      },
      {
        id: "bounty",
        title: "赏金契约",
        desc: "击杀金币 +25%",
        icon: "coin",
        apply: () => {
          this.state.bountyMultiplier += 0.25;
        }
      },
      {
        id: "landing_blast",
        title: "坠落冲击",
        desc: "落地造成范围伤害",
        icon: "impact",
        apply: () => {
          this.state.launchImpactDamage += 18;
        }
      }
    ];
  }
}
