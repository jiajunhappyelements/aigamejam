import Phaser from "phaser";
import { LANES } from "../config/game";
import type { Fighter, GameState } from "../types";
import { Effects } from "./Effects";

export class CombatSystem {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly state: GameState,
    private readonly effects: Effects,
    private readonly onCastleDead: () => void
  ) {}

  update(delta: number) {
    for (const enemy of [...this.state.enemies]) {
      if (!enemy.active) continue;
      enemy.attackTimer -= delta;
      const target = this.nearest(enemy, this.state.allies);
      if (target && Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y) <= enemy.range) {
        this.attack(enemy, target);
      } else if (enemy.y >= LANES.wallY - 10) {
        this.damageCastle(enemy.damage * delta * 0.001);
      } else {
        const slow = enemy.slowUntil && enemy.slowUntil > this.scene.time.now ? 0.42 : 1;
        enemy.y += enemy.speed * slow * delta * 0.001;
      }
    }

    for (const ally of [...this.state.allies]) {
      if (!ally.active || !ally.launched || this.state.pending === ally) continue;
      ally.attackTimer -= delta;
      const target = this.nearest(ally, this.state.enemies);
      if (!target) continue;
      const dist = Phaser.Math.Distance.Between(ally.x, ally.y, target.x, target.y);
      if (dist <= ally.range) {
        this.attack(ally, target);
      } else {
        const angle = Phaser.Math.Angle.Between(ally.x, ally.y, target.x, target.y);
        ally.x += Math.cos(angle) * ally.speed * delta * 0.001;
        ally.y += Math.sin(angle) * ally.speed * delta * 0.001;
      }
    }
  }

  applyDamage(target: Fighter, amount: number) {
    target.hp -= amount;
    this.effects.floatText(target.x, target.y - 55, Math.round(amount).toString(), "#ffffff");
    const bar = target.getByName("hp") as Phaser.GameObjects.Rectangle;
    bar.width = Math.max(0, 44 * (target.hp / target.maxHp));
    target.setAlpha(target.slowUntil && target.slowUntil > this.scene.time.now ? 0.72 : 1);
    if (target.hp <= 0) this.killFighter(target);
  }

  private nearest(source: Fighter, list: Fighter[]) {
    let best: Fighter | undefined;
    let bestDist = Number.POSITIVE_INFINITY;
    for (const candidate of list) {
      if (!candidate.active || candidate === source) continue;
      const d = Phaser.Math.Distance.Squared(source.x, source.y, candidate.x, candidate.y);
      if (d < bestDist) {
        best = candidate;
        bestDist = d;
      }
    }
    return best;
  }

  private attack(attacker: Fighter, target: Fighter) {
    if (attacker.attackTimer > 0) return;
    attacker.attackTimer = attacker.attackCd;
    this.scene.tweens.add({ targets: attacker, scaleX: 1.08, scaleY: 1.08, yoyo: true, duration: 80 });
    let damage = attacker.damage;
    if (attacker.kind === "mage") {
      target.slowUntil = this.scene.time.now + this.state.mageFreezeMs;
      damage *= 0.85;
      this.effects.frost(target.x, target.y);
    }
    if (attacker.kind === "archer") this.spawnProjectile(attacker, target, damage);
    else this.applyDamage(target, damage);
  }

  private spawnProjectile(attacker: Fighter, target: Fighter, damage: number) {
    const dart = this.scene.add.circle(attacker.x, attacker.y - 20, 5, 0xf5e28a, 1).setDepth(18);
    this.scene.tweens.add({
      targets: dart,
      x: target.x,
      y: target.y - 18,
      duration: 180,
      onComplete: () => {
        dart.destroy();
        if (target.active) this.applyDamage(target, damage);
      }
    });
  }

  private killFighter(fighter: Fighter) {
    if (fighter.team === "enemy") {
      const bounty = Math.round((fighter.bounty ?? 0) * this.state.bountyMultiplier);
      this.state.gold += bounty;
      this.effects.floatText(fighter.x, fighter.y - 20, `+${bounty}`, "#ffe27a");
      this.effects.impact(fighter.x, fighter.y);
      this.state.enemies = this.state.enemies.filter((e) => e !== fighter);
    } else {
      this.state.allies = this.state.allies.filter((a) => a !== fighter);
    }
    fighter.destroy();
  }

  private damageCastle(amount: number) {
    this.state.castleHp = Math.max(0, this.state.castleHp - amount);
    if (this.state.castleHp <= 0) {
      this.state.castleHp = 0;
      this.onCastleDead();
    }
  }
}
