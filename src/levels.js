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
loadSprite("lava", duckSpritePath);
loadSprite("castle", castleSpritePath);
loadSprite("fireworks", fireworksSpritePath);
loadSprite("rotated-eagle", rotateeaglePath);
loadSprite("coin", coinSpritePath);
loadSprite("spike", spikeSpritePath);
loadSprite("spikeblock", spikeblockSpritePath);

const socket = io("http://localhost:8080"); // Update the URL if necessary

const players = {};

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

  // Adding collision handlers for the player
  player.onCollide("selectable", (selection) => {
    const { spriteName } = selection;
    addPlayer(id, player.pos.x, player.pos.y, spriteName, 0.15);
  });

  player.onCollide("lobbyPortal", () => {
    go("Lobby", id);
  });

  player.onCollide("portal", () => {
    go("World1", id);
  });

  player.onCollide("charSelectPortal", () => {
    go("CharacterSelection", id);
  });

  player.onCollide("infinitePortal", () => {
    go("InfiniteWorld", id);
  });
};

// Define the spin behavior
const spin = (speed) => {
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
};

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
    go("World1", playerId);
  });

  // Character selection portal in the middle left side of the screen
  const charSelectPortal = add([
    sprite("portal"),
    scale(0.6),
    pos(200, height() / 2), // Middle left side of the screen
    area({ scale: 0.1 }),
    body({ isStatic: true }),
    anchor("center"),
    "charSelectPortal",
  ]);

  // Personalize text
  add([
    text("Personalize", {
      size: 17,
      transform: (idx) => ({
        color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
        pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
        scale: wave(1, 1.2, time() * 3 + idx),
        angle: wave(-9, 9, time() * 3 + idx),
      }),
    }),
    pos(200, height() / 2),
    scale(1),
    anchor("center"),
  ]);

  // Infinite portal in the middle right side of the screen
  const infinitePortal = add([
    sprite("portal"),
    scale(0.6),
    pos(width() - 200, height() / 2), // Middle right side of the screen
    area({ scale: 0.1 }),
    body({ isStatic: true }),
    anchor("center"),
    "infinitePortal",
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
    pos(width() - 200, height() / 2),
    scale(1),
    anchor("center"),
  ]);

  duck.onCollide("charSelectPortal", () => {
    go("CharacterSelection", playerId);
  });

  duck.onCollide("infinitePortal", () => {
    go("InfiniteWorld", playerId);
  });
});

go("Lobby", "player1");

const MAX_CLOUDS = 20;
const PLAYER_SPEED = 500;
const JUMP_FORCE = 1200;
const PLATFORM_HEIGHT = 200;

scene("InfiniteWorld", () => {
  setBackground(135, 206, 235);
  setGravity(4000);

  const players = {};

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

  // Function to add player
  const addPlayer = (id, x, y) => {
    players[id] = add([
      sprite("duck"),
      scale(0.3),
      pos(x, y),
      area(),
      body({ jumpForce: JUMP_FORCE }),
      anchor("center"),
      doubleJump(),
      rotate(0),
      spin(1500),
      { id },
    ]);
  };

  // Player movement
  const move = (x, id) => {
    const player = players[id];
    if (player) {
      player.move(x, 0);
      if (player.pos.x < 0) {
        player.pos.x = width();
      } else if (player.pos.x > width()) {
        player.pos.x = 0;
      }
      socket.emit("playerMovement", { x: player.pos.x, y: player.pos.y });
    }
  };

  socket.on("currentPlayers", (currentPlayers) => {
    for (let id in currentPlayers) {
      if (currentPlayers.hasOwnProperty(id)) {
        addPlayer(id, currentPlayers[id].x, currentPlayers[id].y);
      }
    }
  });

  socket.on("newPlayer", (player) => {
    addPlayer(player.id, player.x, player.y);
  });

  socket.on("playerMoved", (player) => {
    if (players[player.id]) {
      players[player.id].pos.x = player.x;
      players[player.id].pos.y = player.y;
    }
  });

  socket.on("playerDisconnected", (id) => {
    if (players[id]) {
      destroy(players[id]);
      delete players[id];
    }
  });

  // Add current player
  socket.on("connect", () => {
    addPlayer(socket.id, 50, 900);
  });

  onKeyDown("left", () => {
    move(-PLAYER_SPEED, socket.id);
  });

  onKeyDown("right", () => {
    move(PLAYER_SPEED, socket.id);
  });

  players[socket.id]?.onDoubleJump(() => {
    players[socket.id].spin();
  });

  onKeyPress("space", () => {
    players[socket.id]?.doubleJump();
  });

  // Keep track of the highest point reached by the player
  let highestPoint = height();

  // Function to generate platforms (clouds) above the player
  const generatePlatforms = () => {
    const clouds = get("cloud").length;
    if (clouds < MAX_CLOUDS) {
      for (let i = clouds; i < MAX_CLOUDS; i++) {
        if (i === 0) continue;
        add([
          sprite("cloud"),
          area(),
          pos(rand(0, width()), highestPoint - (i * PLATFORM_HEIGHT) - 70),
          anchor("center"),
          body({ isStatic: true }),
          "cloud",
          {
            speed: rand(50, 300),
            dir: choose([-1, 1]),
          },
        ]);
      }
    }
  };

  // Update function for moving platforms
  onUpdate("cloud", (p) => {
    p.move(p.dir * p.speed, 0);
    if (p.pos.x < 85 || p.pos.x > width() - 85) {
      p.dir = -p.dir;
    }
    if (p.pos.y > height()) {
      p.pos.y = -PLATFORM_HEIGHT;
    }
  });

  // Camera view
  onUpdate(() => {
    if (players[socket.id]) {
      camPos(width() / 2, players[socket.id].pos.y);
    }
  });

  // Player collision with portal
  players[socket.id]?.onCollide("portal", () => {
    go("World1");
  });

  // Function to continuously generate platforms as player ascends
  loop(0.5, () => {
    generatePlatforms();
  });

  // Function to create a level with specified cloud speed
  const createLevel = (cloudSpeed) => {
    scene(`Level${cloudSpeed}`, () => {
      // Adjust cloud speed
      get("cloud").forEach((cloud) => {
        cloud.speed = cloudSpeed;
      });
    });
  };

  // Function to handle player reaching sky limit and transition to higher difficulty level
  const checkSkyLimit = () => {
    const skyLimit = -200;
    if (players[socket.id]?.pos.y < skyLimit) {
      const currentLevel = state.level ? parseInt(state.level.replace("Level", "")) : 0;
      const nextLevel = currentLevel + 1;
      const nextCloudSpeed = 500 + nextLevel * 100;

      if (!sceneExists(`Level${nextCloudSpeed}`)) {
        createLevel(nextCloudSpeed);
      }
      go(`Level${nextCloudSpeed}`);
    }
  };

  // Check sky limit and transition to higher difficulty level
  onUpdate(() => {
    checkSkyLimit();
  });
});

go("InfiniteWorld");