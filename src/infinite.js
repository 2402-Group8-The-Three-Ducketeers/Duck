import duckSpritePath from "./components/images/ducksprite.png";
import cloudSpritePath from "./components/images/cloudsprite.png";
import portalSpritePath from "./components/images/portal.png";
import kaboom from "kaboom";

export const setupInfiniteWorld = () => {

// kaboom();

loadSprite("duck", duckSpritePath);
loadSprite("cloud", cloudSpritePath);
loadSprite("portal", portalSpritePath);

const MAX_CLOUDS = 20; // Maximum number of clouds on the screen
const PLAYER_SPEED = 500;
const JUMP_FORCE = 1200;
const NUM_PLATFORMS = 6;
const PLATFORM_HEIGHT = 200;

scene("InfiniteWorld", () => {
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

  // Keep track of the highest point reached by the player
  let highestPoint = height();

  // Function to generate platforms (clouds) above the player
  const generatePlatforms = () => {
    const clouds = get("cloud").length; // Get the current number of clouds on the screen
    if (clouds < MAX_CLOUDS) {
      for (let i = clouds; i < MAX_CLOUDS; i++) {
        // Skip the first cloud at the bottom
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
      p.pos.y = -PLATFORM_HEIGHT; // Reset platform position when it goes below the screen
    }
  });

  // Camera view
  onUpdate(() => {
    camPos(width() / 2, duck.pos.y);
  });

  // Player collision with portal
  duck.onCollide("portal", () => {
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

      // Other level logic goes here
    });
  };

  // Function to handle player reaching sky limit and transition to higher difficulty level
  const checkSkyLimit = () => {
    const skyLimit = -200; // Adjust this value as needed
    if (duck.pos.y < skyLimit) {
      const currentLevel = state.level ? parseInt(state.level.replace("Level", "")) : 0;
      const nextLevel = currentLevel + 1;
      const nextCloudSpeed = 500 + nextLevel * 100; // Adjust the increment as needed

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
}