import duckSpritePath from "./components/images/ducksprite.png"
import cloudSpritePath from "./components/images/cloudsprite.png"
import portalSpritePath from "./components/images/portal.png"
import sharkSpritePath from "./components/images/shark.png"
import grassSpritePath from "./components/images/grass.png"
import sandSpritePath from "./components/images/sand.png"
import eagleSpritePath from "./components/images/eagle.png"
import groundSpritePath from "./components/images/ground.png"
import lavaSpritePath from "./components/images/lava.png"
import castleSpritePath from "./components/images/castle.png"
import fireworksSpritePath from "./components/images/fireworks.png"
import coinSpritePath from "./components/images/coin.png"
import spikeSpritePath from "./components/images/spike.png"
import spikeblockSpritePath from "./components/images/spikeblock.png"
import pizzaSpritePath from "./components/images/pizza.png"
import axeSpritePath from "./components/images/axe.png"

import kaboom from "kaboom";


const VideoGame = () => {

  kaboom({
    // width: 3000,
    // height: 2000,
    // stretch: true,
    // scale: .5,
    // background: [0, 0, 0, 0],
  });

  loadSprite("duck", duckSpritePath);
  loadSprite("cloud", cloudSpritePath);
  loadSprite("portal", portalSpritePath);
  loadSprite("shark", sharkSpritePath);
  loadSprite("grass", grassSpritePath);
  loadSprite("sand", sandSpritePath);
  loadSprite("eagle", eagleSpritePath);
  loadSprite("ground", groundSpritePath);
  loadSprite("castle", castleSpritePath);
  loadSprite("fireworks", fireworksSpritePath);
  loadSprite("coin", coinSpritePath);
  loadSprite("spike", spikeSpritePath);
  loadSprite("spikeblock", spikeblockSpritePath);
  loadSprite("lava", lavaSpritePath);
  loadSprite("pizza", pizzaSpritePath);
  loadSprite("axe", axeSpritePath);

  // LOBBY
  scene("Lobby", () => {
    
    const PLAYER_SPEED = 500;
    const JUMP_FORCE = 1200;
    const NUM_PLATFORMS = 6;
    
    setBackground(135, 206, 235);
    setGravity(4000);

    // character double jump action
    const jumpSpin = (speed) => {
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
        jumpSpin() {
          spinning = true;
        }
      }
    }

    const spin = (speed) => {
      let spinning = true;
      return {
        require: ["rotate"],
        update() {
          if (!spinning) {
            return
          }
          this.angle += speed * dt()
        },
        spin() {
          spinning = true;
        }
      }
    }
    
    // Ground
    add([
      rect(width(), 100),
      area(),
      outline(1),
      pos(0, height()-100),
      color(150, 75, 0),
      body({isStatic: true}),
    ])
    
    // LOBBY TEXT
    add([
      text("LOBBY", {
        size: 100,
      }),
      color(255, 255, 255),
      pos(width()/2, 500),
      scale(2),
      anchor("center"),
    ])

    // platforms
    for (let i = 1; i < NUM_PLATFORMS; i++) {
      add([
        sprite("cloud"),
        area(),
        pos(rand(0, width()), (i * height() / NUM_PLATFORMS - 70)),
        anchor("center"),
        body({isStatic: true}),
        "cloud",
        {
          speed: rand(50, 300),
          dir: choose([-1, 4]),
        }
      ])
    }
    
    onUpdate("cloud", (p) => {
      p.move(p.dir * p.speed, 0)
      if (p.pos.x < 85 || p.pos.x > width()-85) {
        p.dir = -p.dir
      }
    })

    // portal
    const portal = add([
      sprite("portal"),
      scale(.6),
      pos(width()-40, height()-156),
      area({scale: 0.3}),
      anchor("center"),
      "portal",
    ])

    // start text
    add([
      text("Start", {
        size: 17,
        transform: (idx) => ({
          color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
          pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
          scale: wave(1, 1.2, time() * 3 + idx),
          angle: wave(-9, 9, time() * 3 + idx),
        })
      }),
      pos(width()-40, height()-156),
      scale(1),
      anchor("center"),
    ])

    // Player
    const duck = add([
      sprite("duck"),
      scale(.3),
      pos(50, 900),
      area(),
      body({jumpForce: JUMP_FORCE}),
      anchor("center"),
      doubleJump(),
      rotate(0),
      jumpSpin(1500),
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
      duck.flipX = true
      move(-PLAYER_SPEED)
    })
    
    onKeyDown("right", () => {
      duck.flipX = false
      move(PLAYER_SPEED)
    })
    
    duck.onDoubleJump(() => {
      duck.jumpSpin()
    })
    
    onKeyPress("space", () => {
      duck.doubleJump();  
    })

    // Prompt start message
    duck.onCollide("portal", () => {
      add([
        text('Press "Enter"', {
          size: 40,
          transform: (idx) => ({
            color: hsl2rgb((time() * .2 + idx * .1) % .1, 3, .7),
          })
        }),
        pos(width() / 2 - 70, height() / 2 + 390),
      ])
      onKeyPress("enter", () => {
        go("WorldN")
      })
    })

    // collectible pizza object for fun
    add([
      sprite("pizza"),
      pos(10, 10),
      scale(.4),
    ])

    add([
      sprite("pizza"),
      pos(rand(0, width()), rand(0, height() - 100)),
      area({scale: 0.9}),
      scale(.8),
      rotate(),
      spin(300),
      anchor("center"),
      "pizza"
    ])

    let pizzas = 0
    const pizzasCounter = add([
      fixed(),
      text(pizzas, {
        size: 25
      }),
      pos(37, 10),
    ])

    duck.onCollide("pizza", (p) => {
      p.moveTo(rand(0, width()), rand(0, height() - 100))
      pizzas += 1
      pizzasCounter.text = pizzas
    })


  })


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\


  // Normal Mode
  scene("WorldN", () => {
    const PLAYER_SPEED = 500;
    const JUMP_FORCE = 1000;

    setBackground(135, 206, 235);
    setGravity(4000);

    add([
      text("START",{
        size: 300,
      }),
      color(0, 255, 0),
      pos(150, 150),
      opacity(.2),
    ])

    const delay = add([timer()]);

    const eagleMovement = (speed = PLAYER_SPEED - 80, dir = 1) => {
      return {
        id: "eagleMovement",
        require: ["pos"],
        update() {
          wait(3.1, () => {this.move(speed * dir, 0)})
        }
      }
    }

    // Level design
    const LEVEL = [
      [
        ">                                                                                                                                                                         ",
        ">                                                                                                                                                                         ",
        ">                                                                                                                                                                         ",
        ">                                                                     $                                                                                                   ",
        ">                                                                                                                                                                         ",
        ">                                                                     =                                                                                                   ",
        ">                                                                                                                                                                         ",
        ">                                  ==        ====      ========                                                                                                           ",
        ">                                                                                                                                                                         ",
        ">                               ==                                                                                                                                        ",
        ">                                                                                    =                                                                                    ",
        ">                                                                                    =                                   =============           $$      $$      $$      $$      $$      $$      $$                   ",
        ">                        =====                                                       =                                   =============                                     ",
        ">                   ==                                                                        $  $  $  $  $  $  $  $  $  == == == == =                                    ",
        ">       $$$        =                                                                 =                                   == == == == =                                     ",
        "                  =                                                                  =                                                       ",
        "                                       ^^^^^                                         =        ^  ^  ^  ^  ^  ^  ^  ^  ^                      -       -       -       -       -       -       -       -                             ",
        "_                   _                  _                  _          ~~~~~~          _                  _                  _          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~         _                  _                  _                  _                  _                  _                  _                  _                  _                   _      A",
      ],
    ]
    
    const levelConf = {
      tileWidth: 64,
      tileHeight: 64,
      tiles: {
        "_": () => [
          sprite("ground"),
          area(),
          scale(1),
          pos(31, 25),
          anchor("bot"),
          body({isStatic: true}),
          "ground",
        ],
        "=": () => [
          sprite("grass"),
          area(),
          scale(1),
          anchor("bot"),
          body({isStatic: true}),
          offscreen({hide: true}),
          "grass",
        ],
        "-": () => [
          sprite("sand"),
          area(),
          scale(1),
          anchor("bot"),
          body({isStatic: true}),
          offscreen({hide: true}),
          "sand",
        ],
        "~": () => [
          sprite("lava"),
          area({scale: 0.9}),
          scale(.8),
          pos(30, 50),
          anchor("bot"),
          "lava"
        ],
        ">": () => [
          sprite("eagle"),
          area({scale: 0.9}),
          pos(-695, 10),
          scale(.3),
          // eagleMovement(),
          "eagle"
        ],
        "A": () => [
          sprite("castle"),
          area({scale: 0.2}),
          pos(82, -100),
          anchor("bot"),
          scale(),
          "castle"
        ],
        "$": () => [
          sprite("coin"),
          area({scale: 0.9}),
          pos(-14, 20),
          scale(.9),
          "coin"
        ],
        "^": () => [
          sprite("spike"),
          area({scale: 0.9}),
          pos(0, -40),
          scale(1),
          anchor("bot"),
          body({isStatic: true}),
          "spike"
        ],
        "*": () => [
          sprite("spikeblock"),
          area({scale: 0.9}),
          pos(),
          scale(),
          "spikeblock"
        ],
      }
    }

    const level = addLevel(LEVEL[0], levelConf);
      
    // character double jump action
    const jumpSpin = (speed) => {
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
        jumpSpin() {
          spinning = true;
        }
      }
    }

    // Player
    const duck = add([
      sprite("duck"),
      scale(.2),
      pos(5,-50), //starting pos: (5, -50)
      area(),
      body({jumpForce: JUMP_FORCE}),
      anchor("center"),
      doubleJump(),
      rotate(0),
      jumpSpin(1500),
      "duck",
    ])

    // coins counter
    const coinSprite = add([
      sprite("coin"),
      anchor("topright"),
      pos(30, 10),
      scale(.6),
      fixed(),
    ])
    
    // starting cloud platform
    add([
      sprite("cloud"),
      area(),
      pos(0, 0),
      anchor("center"),
      body({isStatic: true}),
      "cloud",
    ])
    onUpdate("cloud", (c) => {
      if (c.pos.y < 800) {
        c.move(0, 360);
      }
    })

    // Player movement
    const playerControl = () => {
      onKeyDown("left", () => {
        duck.flipX = true
        duck.move(-PLAYER_SPEED, 0)
      })
      onKeyDown("right", () => {
        duck.flipX = false
        duck.move(PLAYER_SPEED, 0)
      })
      duck.onDoubleJump(() => {
        duck.jumpSpin()
      })
      onKeyPress("space", () => {
        duck.doubleJump();  
      })
    }

    // Start
    delay.wait(3, () => {
      add([
        text("RUN!            >>>>>  >>>>>  >>>>>", {
          size: 40,
          transform: (idx) => ({
          color: hsl2rgb((time() * 0.5 + idx * 1) % .2, .9, .5),
        })
      }),
        pos(-30, 650),
        lifespan(2, {fade: 0.5}),
      ])
      playerControl()
    });

    // camera view
    duck.onUpdate(() => {
      // center camera to player
        camPos(duck.pos.x + 500, 555)
      })

    //Collision
    duck.onCollide("eagle", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(1.5, () => go("lose"))
    })

    duck.onCollide("lava", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(1.5, () => go("lose"))
    })

    duck.onCollide("spike", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(1.5, () => go("lose"))
    })

    duck.onCollide("spikeblock", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(1.5, () => go("lose"))
    })
    
    duck.onCollide("castle", () => {
      go("win", timePassed, coins)
    })

    duck.onCollideUpdate("sand", (s) => {
      wait(.2, () => {
        s.move(0, 1000)
      })
    })

    let coins = 0
    const coinsCounter = add([
      fixed(),
      text(coins, {
        size: 30
      }),
      pos(36, 11),
    ])
    duck.onCollide("coin", (c) => {
      destroy(c)
      coins += 1
      coinsCounter.text = coins
    })

    // clock
    let timePassed = 0
    const clock = add([
      fixed(),
      anchor("topright"),
      pos(2180, 10),
      text(timePassed),
    ])
    onUpdate(() => {
      wait(3.1, () => {
        timePassed += dt()
        clock.text = timePassed.toFixed(2)
      })
    })

  })


  // Hardmode
  scene("WorldH", () => {

     // shark obstacle
     const spawnShark = () => {
      add([
        sprite("shark"),
        area({scale: 0.9}),
        move(LEFT, rand(500, 2000)),
        pos(10000, rand(height())),
        scale(.25),
        "shark",
      ])
      wait(rand(2, 4), spawnShark)
    }
    
    spawnShark();

    duck.onCollide("shark", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(1.5, () => go("lose"))
    })

  })


  // Win screen
  scene("win", (timePassed, coins) => {
    setBackground(1, 80, 32)
    add([
      rect(width() - 100, height() -100),
      color(1, 80, 32),
      outline(20),
      pos(50, 50),
    ])
    add([
      sprite("fireworks"),
      pos(100, 350),
      scale(1.5),
    ])
    add([
      sprite("fireworks"),
      pos(1380, 350),
      scale(1.5),
    ])
    add([
      sprite("duck"),
      pos(width()/2 + -80, height()/2 - 230),
    ])
    add([
      text("YOU'RE A WINNER!", {
        size: 80,
        transform: (idx) => ({
          color: hsl2rgb((time() * 0.7 + idx * .2) % 1, .9, .5),
          pos: vec2(0, wave(-4, 4, time() * 10 + idx * 4))
        })
      }),
      pos(width()/2 - 280, height()/2 - 350)
    ])
    add([
      rect(275, 120, {radius: 30}),
      pos(width()/2 + -100, height()/2 + 80),
      color(0, 0, 200),
    ])
    add([
      text(`Time: ${timePassed.toFixed(2)}s`),
      pos(width()/2 + -80, height()/2 + 100),
    ])
    add([
      text(`Coins: ${coins}`),
      pos(width()/2 + -80, height()/2 + 150),
    ])

    onKeyPress("space", () => go("Lobby"))

  })


  // Lose screen
  scene("lose", () => {
    setBackground(0, 0, 0);
    add([
      text("YOU DEAD", {
        size: 100,
        wordSpacing: 5,
      }),
      pos(width()/2 - 180, height()/2 - 120),
      color(255, 0, 0),
    ])
    add([
      text("Try again?", {
        size: 40,
      }),
      pos(width()/2 - 65, height()/2),
      color(255, 0, 0),
    ])
    add([
      text("(y/n)", {
        size: 40,
      }),
      color(255,255,255),
      pos(width()/2 - 10, height()/2 + 50),
    ])

    onKeyPress("y", () => go("WorldN"));
    onKeyPress("n", () => go("Lobby"));

  })

  go("WorldN");
}

VideoGame();

export default VideoGame;