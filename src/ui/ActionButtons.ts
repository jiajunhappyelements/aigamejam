import Phaser from "phaser";
import type { GameState } from "../types";

export class ActionButtons {
  private readonly upgradeButton: Phaser.GameObjects.Container;
  private readonly summonButton: Phaser.GameObjects.Container;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly state: GameState,
    onUpgrade: () => void,
    onSummon: () => void
  ) {
    this.upgradeButton = this.createButton(118, 900, "强化", state.upgradeCost.toString(), "coin", onUpgrade);
    this.summonButton = this.createButton(422, 900, "召唤", state.summonCost.toString(), "unit-slinger", onSummon);
  }

  update() {
    const upgradeCost = this.upgradeButton.getByName("cost") as Phaser.GameObjects.Text;
    const summonCost = this.summonButton.getByName("cost") as Phaser.GameObjects.Text;
    upgradeCost.setText(this.state.upgradeCost.toString());
    summonCost.setText(this.state.summonCost.toString());
    this.upgradeButton.setAlpha(this.state.gold >= this.state.upgradeCost && !this.state.modalOpen ? 1 : 0.55);
    this.summonButton.setAlpha(
      this.state.gold >= this.state.summonCost && !this.state.pending && !this.state.modalOpen ? 1 : 0.55
    );
  }

  private createButton(
    x: number,
    y: number,
    title: string,
    cost: string,
    iconKey: string,
    onClick: () => void
  ) {
    const button = this.scene.add.container(x, y);
    button.setSize(150, 82);
    button.setInteractive(new Phaser.Geom.Rectangle(-75, -41, 150, 82), Phaser.Geom.Rectangle.Contains);
    button.on("pointerdown", onClick);
    const bg = this.scene.add.rectangle(0, 0, 150, 82, 0x3b4f56, 1).setStrokeStyle(4, 0xbea479);
    const icon = this.scene.add.image(-42, -5, iconKey).setDisplaySize(48, 48);
    const label = this.scene.add.text(8, -24, title, {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#f6f1c7",
      stroke: "#342814",
      strokeThickness: 5
    });
    const costText = this.scene.add.text(16, 10, cost, {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#ffffff",
      stroke: "#342814",
      strokeThickness: 5
    });
    costText.name = "cost";
    button.add([bg, icon, label, costText]);
    return button;
  }
}
