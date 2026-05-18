import Phaser from "phaser";

export class Effects {
  constructor(private readonly scene: Phaser.Scene) {}

  floatText(x: number, y: number, text: string, color: string) {
    const label = this.scene.add
      .text(x, y, text, {
        fontFamily: "Arial",
        fontSize: "22px",
        color,
        stroke: "#1a2630",
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setDepth(60);
    this.scene.tweens.add({
      targets: label,
      y: y - 36,
      alpha: 0,
      duration: 720,
      onComplete: () => label.destroy()
    });
  }

  impact(x: number, y: number) {
    const boom = this.scene.add.image(x, y, "impact").setDisplaySize(76, 68).setDepth(30).setAlpha(0.9);
    this.scene.tweens.add({
      targets: boom,
      scale: 1.25,
      alpha: 0,
      duration: 260,
      onComplete: () => boom.destroy()
    });
  }

  frost(x: number, y: number) {
    const frost = this.scene.add.circle(x, y, 28, 0x8cecff, 0.25).setDepth(18);
    this.scene.tweens.add({
      targets: frost,
      scale: 1.6,
      alpha: 0,
      duration: 260,
      onComplete: () => frost.destroy()
    });
  }

  landingBlast(x: number, y: number) {
    const blast = this.scene.add.circle(x, y, 48, 0xffd36a, 0.22).setDepth(17);
    this.scene.tweens.add({
      targets: blast,
      scale: 1.8,
      alpha: 0,
      duration: 260,
      onComplete: () => blast.destroy()
    });
  }
}
