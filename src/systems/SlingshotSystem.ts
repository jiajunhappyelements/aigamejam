import Phaser from "phaser";
import { GAME_SIZE, LANES } from "../config/game";
import type { Fighter, GameState } from "../types";
import { CombatSystem } from "./CombatSystem";
import { Effects } from "./Effects";

export class SlingshotSystem {
  readonly aimLine: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly state: GameState,
    private readonly combat: CombatSystem,
    private readonly effects: Effects,
    private readonly onFirstLaunch: () => void
  ) {
    this.aimLine = scene.add.graphics();
    scene.input.on("pointerdown", this.onPointerDown, this);
    scene.input.on("pointermove", this.onPointerMove, this);
    scene.input.on("pointerup", this.onPointerUp, this);
  }

  clearAim() {
    this.aimLine.clear();
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (this.state.modalOpen) return;
    if (!this.state.pending) return;
    if (Phaser.Math.Distance.Between(pointer.x, pointer.y, this.state.pending.x, this.state.pending.y) < 90) {
      this.state.dragging = true;
      this.state.pending.setPosition(pointer.x, pointer.y);
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.state.dragging || !this.state.pending) return;
    const clampedX = Phaser.Math.Clamp(pointer.x, 70, GAME_SIZE.width - 70);
    const clampedY = Phaser.Math.Clamp(pointer.y, 640, 900);
    this.state.pending.setPosition(clampedX, clampedY);
    this.drawAim(clampedX, clampedY);
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    if (!this.state.dragging || !this.state.pending) return;
    const unit = this.state.pending;
    const pullX = LANES.slingX - pointer.x;
    const pullY = LANES.slingY - pointer.y;
    const body = unit.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(Phaser.Math.Clamp(pullX * 3.7, -620, 620), Phaser.Math.Clamp(pullY * 3.3, -820, -160));
    body.setDrag(0, 260);
    unit.launched = true;
    this.state.pending = undefined;
    this.state.dragging = false;
    this.aimLine.clear();
    this.onFirstLaunch();
    this.scene.time.delayedCall(850, () => this.landUnit(unit, body));
  }

  private landUnit(unit: Fighter, body: Phaser.Physics.Arcade.Body) {
    if (!unit.active) return;
    const landY = Phaser.Math.Clamp(unit.y, 190, LANES.wallY - 70);
    unit.setPosition(Phaser.Math.Clamp(unit.x, 64, GAME_SIZE.width - 64), landY);
    body.setVelocity(0, 0);
    body.setDrag(0, 0);
    this.applyLandingImpact(unit);
  }

  private applyLandingImpact(unit: Fighter) {
    if (this.state.launchImpactDamage <= 0) return;
    this.effects.landingBlast(unit.x, unit.y);
    for (const enemy of [...this.state.enemies]) {
      if (!enemy.active) continue;
      if (Phaser.Math.Distance.Between(unit.x, unit.y, enemy.x, enemy.y) <= 95) {
        this.combat.applyDamage(enemy, this.state.launchImpactDamage);
      }
    }
  }

  private drawAim(x: number, y: number) {
    const vx = Phaser.Math.Clamp((LANES.slingX - x) * 3.7, -620, 620);
    const vy = Phaser.Math.Clamp((LANES.slingY - y) * 3.3, -820, -160);
    this.aimLine.clear();
    this.aimLine.lineStyle(4, 0xfff2a5, 0.9);
    let px = x;
    let py = y;
    for (let i = 1; i < 15; i += 1) {
      const t = i / 9;
      const nx = x + vx * t * 0.16;
      const ny = y + vy * t * 0.16 + 420 * t * t * 0.16;
      this.aimLine.lineBetween(px, py, nx, ny);
      px = nx;
      py = ny;
    }
  }
}
