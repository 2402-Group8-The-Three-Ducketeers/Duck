import duckSpritePath from "./components/images/ducksprite.png";
import cloudSpritePath from "./components/images/cloudsprite.png";
import portalSpritePath from "./components/images/portal.png";
import pterodactylSpritePath from "./components/images/pterodactyl.png";
import grassSpritePath from "./components/images/grass.png";
import sandSpritePath from "./components/images/sand.png";
import eagleSpritePath from "./components/images/eagle.png";
import groundSpritePath from "./components/images/ground.png";
import lavaSpritePath from "./components/images/lava.png";
import castleSpritePath from "./components/images/castle.png";
import fireworksSpritePath from "./components/images/fireworks.png";

import rotateeaglePath from "./components/images/eagle-rotate.png";

import coinSpritePath from "./components/images/coin.png";
import spikeSpritePath from "./components/images/spike.png";
import spikeblockSpritePath from "./components/images/spikeblock.png";
import { setupInfiniteWorld } from "./infinite.js";
import kaboom from "kaboom";

// Function that runs our game and is exported to web page to be displayed
const VideoGame = () => {

  kaboom();

  loadSprite("duck", duckSpritePath);
  loadSprite("cloud", cloudSpritePath);
  loadSprite("portal", portalSpritePath);
  loadSprite("pterodactyl", pterodactylSpritePath);
  loadSprite("grass", grassSpritePath);
  loadSprite("sand", sandSpritePath);
  loadSprite("eagle", eagleSpritePath);
  loadSprite("ground", groundSpritePath);
  loadSprite("lava", lavaSpritePath);
  loadSprite("castle", castleSpritePath);
  loadSprite("fireworks", fireworksSpritePath);
  loadSprite("rotated-eagle", rotateeaglePath);
  loadSprite("coin", coinSpritePath);
  loadSprite("spike", spikeSpritePath);
  loadSprite("spikeblock", spikeblockSpritePath);

  // Setup Infinite World
  setupInfiniteWorld();

  // LOBBY
  scene("Lobby", () => {

    const PLAYER_SPEED = 500;
    const JUMP_FORCE = 1200;
    const NUM_PLATFORMS = 6;

    setBackground(135, 206, 235);
    setGravity(4000);

    // Character double jump action
    const spin = (speed) => {
      let spinning = false;
      return {
        require: ["rotate"],
        update() {
          if (!spinning) {
            return;
          }
          this.angle += speed * dt();
          if (this.angle >= 360) {
            spinning = false;
            this.angle = 0;
          }
        },
        spin() {
          spinning = true;
        },
      };
    };

    // Ground
    add([
      rect(width(), 100),
      area(),
      outline(1),
      pos(0, height() - 100),
      color(150, 75, 0),
      body({ isStatic: true }),
    ]);

    // LOBBY TEXT
    add([
      text("LOBBY", {
        size: 100,
      }),
      color(255, 255, 255),
      pos(width() / 2, 500),
      scale(2),
      anchor("center"),
    ]);

    // Platforms
    for (let i = 1; i < NUM_PLATFORMS; i++) {
      add([
        sprite("cloud"),
        area(),
        pos(rand(0, width()), (i * height() / NUM_PLATFORMS - 70)),
        anchor("center"),
        body({ isStatic: true }),
        "cloud",
        {
          speed: rand(50, 300),
          dir: choose([-1, 4]),
        },
      ]);
    }

    onUpdate("cloud", (p) => {
      p.move(p.dir * p.speed, 0);
      if (p.pos.x < 85 || p.pos.x > width() - 85) {
        p.dir = -p.dir;
      }
    });

    // Start portal
    const portalStart = add([
      sprite("portal"),
      scale(0.6),
      pos(width() - 100, height() - 156),
      area({ scale: 0.1 }),
      body({ isStatic: true }),
      anchor("center"),
      "portal",
    ]);

    // Start text
    add([
      text("Start", {
        size: 17,
        transform: (idx) => ({
          color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
          pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
          scale: wave(1, 1.2, time() * 3 + idx),
          angle: wave(-9, 9, time() * 3 + idx),
        }),
      }),
      pos(width() - 100, height() - 156),
      scale(1),
      anchor("center"),
    ]);

    // Infinite portal
    const portalInfinite = add([
      sprite("portal"),
      scale(0.6),
      pos(width() - 200, height() - 156),
      area({ scale: 0.1 }),
      body({ isStatic: true }),
      anchor("center"),
      "portalInfinite",
    ]);

    // Infinite text
    add([
      text("Infinite", {
        size: 17,
        transform: (idx) => ({
          color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
          pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
          scale: wave(1, 1.2, time() * 3 + idx),
          angle: wave(-9, 9, time() * 3 + idx),
        }),
      }),
      pos(width() - 200, height() - 156),
      scale(1),
      anchor("center"),
    ]);

    // Player
    const duck = add([
      sprite("duck"),
      scale(0.3),
      pos(50, 900),
      area(),
      body({ jumpForce: JUMP_FORCE }),
      anchor("center"),
      doubleJump(),
      rotate(0),
      spin(1500),
    ]);

    // Player movement
    const move = (x) => {
      duck.move(x, 0);
      if (duck.pos.x < 0) {
        duck.pos.x = width();
      } else if (duck.pos.x > width()) {
        duck.pos.x = 0;
      }
    };

    onKeyDown("left", () => {
      move(-PLAYER_SPEED);
    });

    onKeyDown("right", () => {
      move(PLAYER_SPEED);
    });

    duck.onDoubleJump(() => {
      duck.spin();
    });

    onKeyPress("space", () => {
      duck.doubleJump();
    });

    duck.onCollide("portal", () => {
      go("World1");
    });

    duck.onCollide("portalInfinite", () => {
      go("InfiniteWorld");
    });

  });

  go("Lobby");
};

export default VideoGame;