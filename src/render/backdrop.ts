import Phaser from "phaser";
import { GAME_SIZE, LANES } from "../config/game";

export function createBackdrop(scene: Phaser.Scene) {
  const { width, height } = GAME_SIZE;
  scene.cameras.main.setBackgroundColor("#20364a");
  const g = scene.add.graphics();
  g.fillStyle(0x283f54, 1).fillRect(0, 0, width, height);
  g.fillStyle(0x6d7f82, 1).fillRoundedRect(54, 118, width - 108, 650, 72);
  g.fillStyle(0x87918c, 1).fillRoundedRect(82, 145, width - 164, 595, 48);

  for (let y = 165; y < 720; y += 72) {
    g.lineStyle(2, 0x707b79, 0.32).lineBetween(105, y, width - 105, y + 8);
  }
  for (let x = 126; x < width - 100; x += 74) {
    g.lineStyle(2, 0x707b79, 0.25).lineBetween(x, 160, x - 12, 722);
  }

  scene.add.image(width / 2, LANES.wallY + 8, "wall").setDisplaySize(410, 120);
  scene.add.rectangle(width / 2, LANES.wallY + 72, width, 110, 0x2b3542, 0.84);
  scene.add.circle(LANES.slingX - 33, LANES.slingY - 2, 7, 0xd7b27c);
  scene.add.circle(LANES.slingX + 33, LANES.slingY - 2, 7, 0xd7b27c);
  scene.add.line(LANES.slingX, LANES.slingY, -31, 0, 0, 28, 0xc9965a, 1).setLineWidth(8);
  scene.add.line(LANES.slingX, LANES.slingY, 31, 0, 0, 28, 0xc9965a, 1).setLineWidth(8);
}
