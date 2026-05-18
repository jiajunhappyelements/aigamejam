import Phaser from "phaser";
import { CASTLE, GAME_SIZE } from "../config/game";
import type { GameState } from "../types";

export class Hud {
  private readonly goldText: Phaser.GameObjects.Text;
  private readonly hpBar: Phaser.GameObjects.Rectangle;
  private readonly waveText: Phaser.GameObjects.Text;
  readonly launchHint: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly state: GameState
  ) {
    this.goldText = scene.add.text(20, 18, "", {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#ffffff",
      stroke: "#173040",
      strokeThickness: 5
    });
    this.waveText = scene.add
      .text(GAME_SIZE.width / 2, 34, "", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#f5fbff",
        stroke: "#173040",
        strokeThickness: 6
      })
      .setOrigin(0.5);

    scene.add
      .rectangle(GAME_SIZE.width / 2, GAME_SIZE.height - 28, GAME_SIZE.width - 70, 20, 0x142028, 1)
      .setStrokeStyle(3, 0x314958);
    this.hpBar = scene.add
      .rectangle(36, GAME_SIZE.height - 28, GAME_SIZE.width - 72, 14, 0x41df56, 1)
      .setOrigin(0, 0.5);
    this.launchHint = scene.add
      .text(GAME_SIZE.width / 2, 736, "点右下角召唤，再拖拽士兵发射到战场", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#e9fbff",
        stroke: "#173040",
        strokeThickness: 5
      })
      .setOrigin(0.5);
  }

  update() {
    this.goldText.setText(`金币 ${Math.floor(this.state.gold)}`);
    this.waveText.setText(`第 ${this.state.wave} 波`);
    this.hpBar.width = (GAME_SIZE.width - 72) * (this.state.castleHp / CASTLE.maxHp);
  }
}
