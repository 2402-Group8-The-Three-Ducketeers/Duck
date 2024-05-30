import duckSpritePath from "./components/images/ducksprite.png";
import cloudSpritePath from "./components/images/cloudsprite.png";
import portalSpritePath from "./components/images/portal.png";
import kaboom from "kaboom";
import { io } from "socket.io-client";

kaboom();

loadSprite("duck", duckSpritePath);
loadSprite("cloud", cloudSpritePath);
loadSprite("portal", portalSpritePath);

const socket = io("http://localhost:8080"); // Update the URL if necessary

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