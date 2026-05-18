import Phaser from "phaser";
import type { EnemySpec, Fighter, GameState, Team, UnitKind, UnitSpec } from "../types";

export class FighterFactory {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly state: GameState
  ) {}

  create(
    x: number,
    y: number,
    texture: string,
    kind: UnitKind | EnemySpec["kind"],
    team: Team,
    spec: UnitSpec | EnemySpec
  ): Fighter {
    const bodyScale = team === "ally" ? 0.2 : (spec as EnemySpec).scale;
    const container = this.scene.add.container(x, y) as Fighter;
    const shadow = this.scene.add.ellipse(0, 34, 46, 16, 0x0e1b20, 0.28);
    const img = this.scene.add.image(0, 0, texture).setScale(bodyScale);
    const hpBg = this.scene.add.rectangle(0, -42, 44, 5, 0x211d22, 0.9);
    const hpFg = this.scene.add
      .rectangle(-22, -42, 44, 5, team === "ally" ? 0x4af06a : 0xff5b4f, 1)
      .setOrigin(0, 0.5);
    hpFg.name = "hp";
    container.add([shadow, img, hpBg, hpFg]);

    const hp = team === "ally" ? spec.hp * this.state.hpMultiplier : spec.hp;
    container.kind = kind;
    container.team = team;
    container.hp = hp;
    container.maxHp = hp;
    container.damage =
      team === "ally" ? spec.damage * this.state.unitDamageMultiplier[kind as UnitKind] : spec.damage;
    container.range = kind === "archer" ? spec.range * this.state.archerRangeMultiplier : spec.range;
    container.speed = spec.speed;
    container.attackCd = team === "ally" ? 760 : 980;
    container.attackTimer = Phaser.Math.Between(0, 400);
    if (team === "enemy") container.bounty = (spec as EnemySpec).bounty;

    this.scene.physics.add.existing(container);
    const body = container.body as Phaser.Physics.Arcade.Body;
    body.setCircle(22, -22, 12);
    body.setCollideWorldBounds(false);

    if (team === "ally") this.state.allies.push(container);
    else this.state.enemies.push(container);
    return container;
  }
}
