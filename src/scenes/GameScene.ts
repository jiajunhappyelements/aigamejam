import Phaser from "phaser";
import { GAME_SIZE, createInitialState } from "../config/game";
import { createBackdrop } from "../render/backdrop";
import { createSpriteTextures } from "../render/spriteTextures";
import { FighterFactory } from "../entities/FighterFactory";
import { ActionButtons } from "../ui/ActionButtons";
import { Hud } from "../ui/Hud";
import { UpgradeModal } from "../ui/UpgradeModal";
import { CombatSystem } from "../systems/CombatSystem";
import { Effects } from "../systems/Effects";
import { SlingshotSystem } from "../systems/SlingshotSystem";
import { SummonSystem } from "../systems/SummonSystem";
import { UpgradeSystem } from "../systems/UpgradeSystem";
import { WaveSystem } from "../systems/WaveSystem";
import type { GameState } from "../types";

export class GameScene extends Phaser.Scene {
  private state!: GameState;
  private hud!: Hud;
  private actionButtons!: ActionButtons;
  private waveSystem!: WaveSystem;
  private combatSystem!: CombatSystem;
  private slingshotSystem!: SlingshotSystem;

  preload() {
    this.load.image("ai-sprite-sheet", "/assets/ai-sprite-sheet-keyed.png");
  }

  create() {
    this.state = createInitialState();
    createSpriteTextures(this);
    createBackdrop(this);

    const effects = new Effects(this);
    const fighterFactory = new FighterFactory(this, this.state);
    this.combatSystem = new CombatSystem(this, this.state, effects, () => this.showGameOver());
    this.waveSystem = new WaveSystem(this, this.state, fighterFactory, effects);

    const upgradeModal = new UpgradeModal(this);
    const upgradeSystem = new UpgradeSystem(this.state, effects, (upgrades, onPick) => {
      this.state.dragging = false;
      this.slingshotSystem?.clearAim();
      upgradeModal.open(upgrades, onPick);
    });
    const summonSystem = new SummonSystem(this.state, fighterFactory, effects);

    this.hud = new Hud(this, this.state);
    this.actionButtons = new ActionButtons(
      this,
      this.state,
      () => upgradeSystem.tryOpenUpgradeModal(),
      () => summonSystem.summonRandomUnit()
    );
    this.slingshotSystem = new SlingshotSystem(this, this.state, this.combatSystem, effects, () => {
      this.hud.launchHint.setVisible(false);
    });
  }

  update(_time: number, delta: number) {
    if (!this.state) return;
    if (this.state.modalOpen) {
      this.updateUi();
      return;
    }

    this.waveSystem.update(delta);
    this.combatSystem.update(delta);
    this.updateUi();
  }

  private updateUi() {
    this.hud.update();
    this.actionButtons.update();
  }

  private showGameOver() {
    this.scene.pause();
    this.add.rectangle(GAME_SIZE.width / 2, GAME_SIZE.height / 2, GAME_SIZE.width, GAME_SIZE.height, 0x071019, 0.72).setDepth(100);
    this.add
      .text(GAME_SIZE.width / 2, GAME_SIZE.height / 2, "城墙被攻破\n刷新页面再来一局", {
        fontFamily: "Arial",
        fontSize: "34px",
        color: "#ffffff",
        align: "center",
        stroke: "#152430",
        strokeThickness: 6
      })
      .setOrigin(0.5)
      .setDepth(101);
    this.state.castleHp = 0;
    this.slingshotSystem.clearAim();
  }
}
