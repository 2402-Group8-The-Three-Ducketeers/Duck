import kaboom from "kaboom";
import { io } from "socket.io-client";
import duckSpritePath from "./components/images/ducksprite.png";
import duck3SpritePath from "./components/images/duck3.png";
import duck4SpritePath from "./components/images/duck4.png";
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

kaboom();

loadSprite("duck", duckSpritePath);
loadSprite("duck3", duck3SpritePath);
loadSprite("duck4", duck4SpritePath);
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

const socket = io("http://localhost:8080"); // Update the URL if necessary

const players = {};

// Register the spin component
kaboom.register("spin", spin);

// Helper function to add a player
const addPlayer = (id, x, y, spriteName = "duck", scaleSize = 0.3) => {
  if (players[id]) {
    destroy(players[id]);
  }

  players[id] = add([
    sprite(spriteName),
    scale(scaleSize),
    pos(x, y),
    area(),
    body({ jumpForce: 1200 }),
    anchor("center"),
    doubleJump(),
    rotate(0),
    spin(1500),
    {
      id,
      spriteName,
      spinning: false,
      spinSpeed: 1500,
    },
  ]);

  // Player movement
  const PLAYER_SPEED = 500;
  const player = players[id];
  const move = (x) => {
    player.move(x, 0);
    if (player.pos.x < 0) {
      player.pos.x = width();
    } else if (player.pos.x > width()) {
      player.pos.x = 0;
    }
  };

  onKeyDown("left", () => {
    move(-PLAYER_SPEED);
  });

  onKeyDown("right", () => {
    move(PLAYER_SPEED);
  });

  player.onDoubleJump(() => {
    player.spin();
  });

  onKeyPress("space", () => {
    player.doubleJump();
  });
};

// Define the spin behavior
function spin(speed) {
  return {
    require: ["rotate"],
    update() {
      if (this.spinning) {
        this.angle += speed * dt();
        if (this.angle >= 360) {
          this.spinning = false;
          this.angle = 0;
        }
      }
    },
    spin() {
      this.spinning = true;
    },
  };
}

// Scene: Character Selection
scene("CharacterSelection", (playerId) => {
  setBackground(135, 206, 235);

  add([
    text("Choose Your Character", { size: 48 }),
    pos(width() / 2, 100),
    anchor("center"),
  ]);

  const duck3 = add([
    sprite("duck3"),
    scale(0.15), // Adjusted to make the duck smaller
    pos(width() / 2 - 200, height() / 2),
    area(),
    anchor("center"),
    "selectable",
    { spriteName: "duck3" },
  ]);

  const duck4 = add([
    sprite("duck4"),
    scale(0.15), // Adjusted to make the duck smaller
    pos(width() / 2 + 200, height() / 2),
    area(),
    anchor("center"),
    "selectable",
    { spriteName: "duck4" },
  ]);

  if (!players[playerId]) {
    addPlayer(playerId, width() / 2, height() - 150);
  }

  const player = players[playerId];

  // Add ground to the Character Selection scene
  add([
    rect(width(), 100),
    area(),
    outline(1),
    pos(0, height() - 100),
    color(150, 75, 0),
    body({ isStatic: true }),
  ]);

  // Add portal to go back to the lobby
  add([
    sprite("portal"),
    scale(0.6),
    pos(width() - 100, height() - 150),
    area(),
    anchor("center"),
    "lobbyPortal",
  ]);

  player.onCollide("selectable", (selection) => {
    const { spriteName } = selection;
    players[playerId].spriteName = spriteName;  // Save the chosen sprite name
    addPlayer(playerId, player.pos.x, player.pos.y, spriteName, 0.15);
  });

  player.onCollide("lobbyPortal", () => {
    go("Lobby", playerId);
  });
});

// Scene: Lobby
scene("Lobby", (playerId) => {
  const PLAYER_SPEED = 500;
  const JUMP_FORCE = 1200;
  const NUM_PLATFORMS = 6;

  setBackground(135, 206, 235);
  setGravity(4000);

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

  // platforms
  for (let i = 1; i < NUM_PLATFORMS; i++) {
    add([
      sprite("cloud"),
      area(),
      pos(rand(0, width()), i * height() / NUM_PLATFORMS - 70),
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

  // portal
  const portal = add([
    sprite("portal"),
    scale(0.6),
    pos(width() - 40, height() - 156),
    area({ scale: 0.1 }),
    body({ isStatic: true }),
    anchor("center"),
    "portal",
  ]);

  // start text
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
    pos(width() - 40, height() - 156),
    scale(1),
    anchor("center"),
  ]);

  // Player
  const playerSprite = players[playerId]?.spriteName || "duck";
  const duck = add([
    sprite(playerSprite),
    scale(playerSprite === "duck" ? 0.3 : 0.15), // Adjust scale based on sprite
    pos(50, 900),
    area(),
    body({ jumpForce: JUMP_FORCE }),
    anchor("center"),
    doubleJump(),
    rotate(0),
    spin(1500),
    {
      id: playerId,
      spriteName: playerSprite,
    }
  ]);

  players[playerId] = duck; // Update the players object with the new duck instance

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
    go("World1", playerId);
  });

  const charSelectPortal = add([
    sprite("portal"),
    scale(0.6),
    pos(width() - 200, height() - 156),
    area({ scale: 0.1 }),
    body({ isStatic: true }),
    anchor("center"),
    "charSelectPortal",
  ]);

  duck.onCollide("charSelectPortal", () => {
    go("CharacterSelection", playerId);
  });
});

go("Lobby", "player1");