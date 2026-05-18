import Phaser from "phaser";
import { ECONOMY, GAME_SIZE, WAVE } from "../config/game";
import { ENEMY_SPECS } from "../config/enemies";
import type { EnemyKind, GameState } from "../types";
import { FighterFactory } from "../entities/FighterFactory";
import { Effects } from "./Effects";

export class WaveSystem {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly state: GameState,
    private readonly fighterFactory: FighterFactory,
    private readonly effects: Effects
  ) {}

  update(delta: number) {
    this.state.waveTime += delta;
    this.state.spawnTimer -= delta;
    if (this.state.spawnTimer <= 0) {
      this.spawnEnemy();
      this.state.spawnTimer = Math.max(
        WAVE.minSpawnDelayMs,
        WAVE.baseSpawnDelayMs - this.state.wave * WAVE.spawnDelayStepMs
      );
    }

    if (this.state.waveTime > WAVE.waveDurationMs) {
      this.state.wave += 1;
      this.state.waveTime = 0;
      this.state.gold += ECONOMY.waveBonusGold;
      this.effects.floatText(GAME_SIZE.width / 2, 180, `第 ${this.state.wave} 波 +${ECONOMY.waveBonusGold}`, "#fff7aa");
    }
  }

  private spawnEnemy() {
    const kind: EnemyKind = this.state.wave > 2 && Math.random() < 0.24 ? "ogre" : "goblin";
    const spec = ENEMY_SPECS[kind];
    const x = Phaser.Math.Between(90, GAME_SIZE.width - 90);
    this.fighterFactory.create(x, -60, spec.texture, kind, "enemy", spec).setDepth(8);
  }
}
