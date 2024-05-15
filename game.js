// game.js
import kaboom from "kaboom";

kaboom({
  background: [135, 206, 235]
});


loadSprite("duck", "/sprites/ducksprite.png");
loadSprite("cloud", "/sprites/cloudsprite.png");

const SPEED = 500;
const JUMP_FORCE = 1200;
const NUM_PLATFORMS = 7;

setGravity(4000);

const spin = (speed) => {
  let spinning = false;
  return {
    require: ["rotate"],
    update() {
      if (!spinning) {
        return
      }
      this.angle += speed * dt()
      if (this.angle >= 360) {
        spinning = false
        this.angle = 0
      }
    },
    spin() {
      spinning = true;
    }
  }
}

// Ground
add([
  rect(width(), 120),
  area(),
  outline(1),
  pos(0, height()-120),
  color(150, 75, 0),
  body({isStatic: true}),
])

// Player
const duck = add([
  sprite("duck"),
  scale(.3),
  pos(50, 500),
  area(),
  body({jumpForce: JUMP_FORCE}),
  anchor("center"),
  doubleJump(),
  rotate(0),
  spin(1500),
])


// Player movement
const move = (x) => {
  duck.move(x, 0)
  if (duck.pos.x < 0) {
    duck.pos.x = width()
  } else if (duck.pos.x > width()) {
    duck.pos.x = 0
  }
}

onKeyDown("left", () => {
  move(-SPEED)
})

onKeyDown("right", () => {
  move(SPEED)
})

duck.onDoubleJump(() => {
  duck.spin()
})

onKeyPress("space", () => {
  duck.doubleJump();  
})

// platforms
for (let i = 1; i < NUM_PLATFORMS; i++) {
  add([
    sprite("cloud"),
    area(),
    pos(rand(0, width()), (i * height() / NUM_PLATFORMS - 100)),
    anchor("center"),
    body({isStatic: true}),
    "platform",
    {
      speed: rand(120, 320),
      dir: choose([-1, 1]),
    }
  ])
}

onUpdate("platform", (p) => {
  p.move(p.dir * p.speed, 0)
  if (p.pos.x < 0 || p.pos.x > width()) {
    p.dir = -p.dir
  }
})