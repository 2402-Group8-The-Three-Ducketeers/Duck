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
import rotateeaglePath from "./components/images/eagle-rotate.png"
import coinSpritePath from "./components/images/coin.png"
import spikeSpritePath from "./components/images/spike.png"
import spikeblockSpritePath from "./components/images/spikeblock.png"
import pizzaSpritePath from "./components/images/pizza.png"
import axeSpritePath from "./components/images/axe.png"
import giantSpritePath from "./components/images/giant.png"
import bombSpritePath from "./components/images/bomb.png"

import kaboom from "kaboom";


//function that runs our game and is exported to web page to be displayed
const VideoGame = () => {


  kaboom({
    width: window.innerWidth-50,
    height: window.innerHeight-50,
  });

  loadSprite("duck", duckSpritePath);
  loadSprite("cloud", cloudSpritePath);
  loadSprite("portal", portalSpritePath);
  loadSprite("grass", grassSpritePath);
  loadSprite("sand", sandSpritePath);
  loadSprite("eagle", eagleSpritePath);
  loadSprite("ground", groundSpritePath);
  loadSprite("castle", castleSpritePath);
  loadSprite("fireworks", fireworksSpritePath);
  loadSprite("rotated-eagle", rotateeaglePath)
  loadSprite("coin", coinSpritePath);
  loadSprite("spike", spikeSpritePath);
  loadSprite("spikeblock", spikeblockSpritePath);
  loadSprite("lava", lavaSpritePath);
  loadSprite("pizza", pizzaSpritePath);
  loadSprite("axe", axeSpritePath);
  loadSprite("giant", giantSpritePath);
  loadSprite("bomb", bombSpritePath);
  loadSprite("shark", sharkSpritePath);

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
        text("Press a number to start!", {
          size: 40,
          transform: (idx) => ({
            color: hsl2rgb((time() * .2 + idx * .1) % .1, 3, .7),
          })
        }),
        pos(width() / 2 - 250, height() / 2 + 380),
      ])

      add([
        text("(1) World 1 Normal", {
          size: 30,
          transform: (idx) => ({
            color: hsl2rgb((time() * .1 + idx * 2) % 2, .5, .8),
          })
        }),
        pos(width() / 2 - 930, height() / 2 + 495),
      ])

      add([
        text("(2) World 1 Hell", {
          size: 30,
          transform: (idx) => ({
            color: hsl2rgb((time() * .1 + idx * 2) % 2, .5, .8),
          })
        }),
        pos(width() / 2 - 390, height() / 2 + 495),
      ])

      add([
        text("(3) World 2 Normal", {
          size: 30,
          transform: (idx) => ({
            color: hsl2rgb((time() * .1 + idx * 2) % 2, .5, .8),
          })
        }),
        pos(width() / 2 + 130, height() / 2 + 495),
      ])

      add([
        text("(4) World Infinite", {
          size: 30,
          transform: (idx) => ({
            color: hsl2rgb((time() * .1 + idx * 2) % 2, .5, .8),
          })
        }),
        pos(width() / 2 + 630, height() / 2 + 495),
      ])

      // game menu
      onKeyPress("1", () => {
       go("WorldN");
      })

      onKeyPress("2", () => {
       go("WorldH");
      })

      onKeyPress("3", () => {
       go("World2");
      })

      onKeyPress("4", () => {
       go("WorldI");
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
    const JUMP_FORCE = 1030;
    const FALL_DEATH = 1200;

    setBackground(135, 206, 235);
    setGravity(4000);

    add([
      text("START",{
        size: 300,
      }),
      color(0, 255, 0),
      pos(150, 150),
      opacity(.2),
      offscreen({hide: true}),
    ])

    add([
      text("CONGRATS!", {
        size: 80,
        transform: (idx) => ({
          color: hsl2rgb((time() * 2 + idx * .6) % .9, 1, .5),
          pos: vec2(0, wave(-8, 8, time() * 30 + idx * 4))
        })
      }),
      pos(26000, 750),
      opacity(.6),
      offscreen({hide: true}),
    ])

    const delay = add([timer()]);

    const eagleMovement = (speed = PLAYER_SPEED - 150, dir = 1) => {
      return {
        id: "eagleMovement",
        require: ["pos"],
        update () {
          wait(3.1, () => {this.move(speed * dir, 0)})
        }
      }
    }

    const mobPatrol = (speed = 200, dir = 1) => {
      return {
        id: "mobPatrol",
        require: ["pos", "area"],
        add() {
          this.on("collide", (obj, col) => {
            if (col.isLeft() || col.isRight()) {
              dir = -dir
            }
          })
        },
        update() {
          this.move(speed * dir, 0)
        }
      }
    }

    // Level design
    const LEVEL = [
      [
        ">                                                                                                                                                                                                                          =                                                                                                                                                                                                        =",
        ">                                                                                                                                                                                                                          ============================                      ===================================================  =======                                                                       ===========         =",
        ">                                                                                                                                                                                                                          =$                         ========               =     $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $  ====    $*=                                                                       ==                  =",
        ">                                                                     $                                                                                                                                                    =$                                ==              =  =                                                  * $ *=                                                                       ==        =         =",
        ">                                                                                                                                                                                                                          =     ===========================  ==   ===========  ====================================================*  *=                                                                                ==         =",
        ">                                                                     =                                                                                                                                                    =   ===                         ==  == ==      $$$   =                                                  =*   =                                                                               ==          =",
        ">                                                                                                                                                                                                                          =    $=                          ==  ===  =====   ====                                                  =* $ =                                                                              ==           =",
        ">                                  ==        ====      ========                                                                                                                                                            =    $=                           ==  =  == *                                                           = $  =                                                                             ==            =",
        ">                                                                                                                                                                                                                          ===   =                            ==   ==  *                                                           =* * =                                                                            ==             =",
        ">                               ==                                                                                                                                                                                         =     =                             =====   *                                                           =  * =                                                                           ==              =",
        ">                                                                                    =                                                                                                                                     =     =                                     *                                                           = $* =                                                                          ==               =",
        ">                                                                                    =                                   =============           $$      $$      $$      $$      $$      $$      $$          ===============   ===                                     *                                                           = $* =            $      $      ******                                         ==                =",
        ">                        =====                                                       =                                   =============                                                                              $$$         $=                                     *                                                           = $* =$                       -                                              ===                 =",
        ">                   ==                                                                        $  $  $  $  $  $  $  $  $  == == == == =                                                                                           =                                     *                                                           = $* =            =      =        $    =========================================                 =",
        ">       $$$        =                                                                 =                                   == == == == =                                                                                     =======                                     *                                                           = $* ==           =      =     ** $******************* $$$$$$$$$$$$$$$$$$$$$$$$$$$               =",
        "                  =                                                                  =                                                                                                                                     =                                           *                                                           =                 =      =                                                                       =",
        "                                       ^^^^^                                         =        ^  ^  ^  ^  ^  ^  ^  ^  ^                      -       -       -       -       -       -       -       -              ========                                                                                                       =^                        ^^^^^                                                                  =",
        "_                   _                  _                  _          ~~~~~~          _                  _                  _          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~         _                  _                  _          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~          _                  _                  _                  _                   _      A   =",
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
          offscreen({hide: true}),
          "lava"
        ],
        ">": () => [
          sprite("eagle"),
          area({scale: 0.9}),
          pos(-695, 10),
          scale(.3),
          eagleMovement(),
          offscreen({hide: true}),
          "eagle"
        ],
        "A": () => [
          sprite("castle"),
          area({scale: 0.2}),
          pos(60, -100),
          anchor("bot"),
          scale(),
          offscreen({hide: true}),
          "castle"
        ],
        "$": () => [
          sprite("coin"),
          area({scale: 0.9}),
          pos(-14, 20),
          scale(.9),
          offscreen({hide: true}),
          "coin"
        ],
        "^": () => [
          sprite("spike"),
          area({scale: 0.9}),
          pos(0, -40),
          scale(1),
          anchor("bot"),
          body({isStatic: true}),
          offscreen({hide: true}),
          "spike"
        ],
        "*": () => [
          sprite("spikeblock"),
          area({scale: 0.7}),
          pos(20, -8),
          scale(2),
          offscreen({hide: true}),
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
      pos(5, -50), //starting pos: (5, -50)
      area(),
      body({jumpForce: JUMP_FORCE}),
      anchor("center"),
      doubleJump(),
      rotate(0),
      jumpSpin(1500),
      "duck",
    ])

    // Giant patrol mob
    const giant = add([
      sprite("giant"),
      pos(24500, 605),
      area({scale: 0.9}),
      scale(.8),
      mobPatrol(),
      offscreen({hide: true}),
      "giant",
    ])
    
    // starting cloud platform
    add([
      sprite("cloud"),
      area(),
      pos(0, 0),
      anchor("center"),
      body({isStatic: true}),
      offscreen({hide: true}),
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

    // Spinning axe
    const spinAxe = (position = vec2(0), angle = 0, num = 5) => {
      const axe = add([
        pos(position),
        rotate(angle),
      ])

      for (let i = 0; i < num; i++) {
        axe.add([
          sprite("axe"),
          pos(0, i * 38),
          area({scale: 0.9}),
          scale(),
          anchor("center"),
          offscreen({hide: true}),
          "axe",
        ])
      }
      axe.onUpdate(() => {
        axe.angle += dt() * -150
      })

      return axe;
    }
    
    spinAxe(vec2(15400, 10), -180)
    spinAxe(vec2(14600, 10), -60)
    spinAxe(vec2(21200, 850), -60)
    spinAxe(vec2(22047, 740), -60)
    spinAxe(vec2(22047, 740), -240)

    // Confetti
    const DEF_COUNT = 80
    const DEF_GRAVITY = 800
    const DEF_AIR_DRAG = 0.9
    const DEF_VELOCITY = [1000, 4000]
    const DEF_ANGULAR_VELOCITY = [-200, 200]
    const DEF_FADE = 0.2
    const DEF_SPREAD = 40
    const DEF_SPIN = [2, 8]
    const DEF_SATURATION = 2
    const DEF_LIGHTNESS = 0.5

    const addConfetti = (opt = {}) => {
      const sample = (s) => typeof s === "function" ? s() : s
      for (let i = 0; i < (opt.count ?? DEF_COUNT); i++) {
        const p = add([
          pos(26680, 850),
          choose([
            rect(rand(5, 20), rand(5, 20)),
            circle(rand(3, 10)),
          ]),
          color(sample(opt.color ?? hsl2rgb(rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS))),
          opacity(1),
          lifespan(7),
          scale(.6),
          anchor("center"),
          rotate(rand(0, 360)),
          offscreen({hide: true}),
        ])
        const spin = rand(DEF_SPIN[0], DEF_SPIN[1])
        const gravity = opt.gravity ?? DEF_GRAVITY
        const airDrag = opt.airDrag ?? DEF_AIR_DRAG
        const heading = sample(opt.heading ?? 0) - 90
        const spread = opt.spread ?? DEF_SPREAD
        const head = heading + rand(-spread / 2, spread / 2)
        const fade = opt.fade ?? DEF_FADE
        const vel = sample(opt.velocity ?? rand(DEF_VELOCITY[0], DEF_VELOCITY[1]))
        let velX = Math.cos(deg2rad(head)) * vel
        let velY = Math.sin(deg2rad(head)) * vel
        const velA = sample(opt.angularVelocity ?? rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]))
        p.onUpdate(() => {
          velY += gravity * dt()
          p.pos.x += velX * dt()
          p.pos.y += velY * dt()
          p.angle += velA * dt()
          p.opacity -= fade * dt()
          velX *= airDrag
          velY *= airDrag
          p.scale.x = wave(-1, 1, time() * spin)
        })
      }
      wait(2, addConfetti)
    }

    addConfetti()
    
    // Start
    delay.wait(3, () => {
      add([
        text("RUN!", {
          size: 40,
      }),
      color(255, 0, 0),
      pos(-30, 650),
      lifespan(3, {fade: 0.5}),
      ])
    });

    delay.wait(3, () => {
      add([
        text("                >>>>>  >>>>>  >>>>>", {
          size: 40,
          transform: (idx) => ({
          color: hsl2rgb((time() * .6 + idx * .6) % .7, 5, 5),
        })
      }),
        pos(-30, 650),
        lifespan(3, {fade: 0.5}),
      ])
      playerControl()
    });

    // camera view
    duck.onUpdate(() => {
      // center camera to player
      if (duck.pos.x < 25300) {
        camPos(duck.pos.x + 500, 555)
        }
      })

      duck.onUpdate(() => {
        if (duck.pos.y > FALL_DEATH) {
          wait(3,() => go("lose"))
        }
      })

    //Collision
    duck.onCollide("eagle", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("lava", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("spike", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("spikeblock", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("axe", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("giant", (e, col) => {
        addKaboom(duck.pos)
        duck.destroy()
        wait(2, () => go("lose"))
      }
    )
    
    duck.onCollide("castle", () => {
      go("win", timePassed, coins)
    })

    duck.onCollideUpdate("sand", (s) => {
      wait(.2, () => {
        s.move(0, 1000)
      })
    })

    // coin counter
    const coinSprite = add([
      sprite("coin"),
      anchor("topright"),
      pos(30, 10),
      scale(.6),
      fixed(),
    ])

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

  })


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\


  // Hellmode
  scene("WorldH", () => {

    const PLAYER_SPEED = 500;
    const JUMP_FORCE = 1030;
    const FALL_DEATH = 1200;

    setBackground(255, 126, 131);
    setGravity(4000);

    add([
      text("START",{
        size: 250,
      }),
      color(0, 0, 100),
      pos(150, 80),
      opacity(.2),
      offscreen({hide: true}),
    ])

    add([
      text("Mission Impossible",{
        size: 100,
      }),
      color(0, 0, 100),
      pos(10, 300),
      opacity(.2),
      offscreen({hide: true}),
    ])

    add([
      text("CONGRATS!", {
        size: 80,
        transform: (idx) => ({
          color: hsl2rgb((time() * 2 + idx * .6) % .9, 1, .5),
          pos: vec2(0, wave(-8, 8, time() * 30 + idx * 4))
        })
      }),
      pos(37880, 550),
      opacity(.6),
      offscreen({hide: true}),
    ])

    const delay = add([timer()]);

    const eagleMovement = (speed = PLAYER_SPEED - 105, dir = 1) => {
      return {
        id: "eagleMovement",
        require: ["pos"],
        update () {
          wait(3.1, () => {this.move(speed * dir, 0)})
        }
      }
    }

    const mobPatrol = (speed = 300, dir = 1) => {
      return {
        id: "mobPatrol",
        require: ["pos", "area"],
        add() {
          this.on("collide", (obj, col) => {
            if (col.isLeft() || col.isRight()) {
              dir = -dir
            }
          })
        },
        update() {
          this.move(speed * dir, 0)
        }
      }
    }

    // Level design
    const LEVEL = [
      [
        ">                                                                                                                                                                                                                          =                                                                                                                                                                                                                                                                                                                                                                                                  ",
        ">                                                                                                                                                                                                                          ============================                  =                                                         ======                                                                                                       =                                                                                                                                                                  $          ",
        ">                                                                                                                                                                                                                          =$                         ========           =                                                            $*=                                                                                     =-                                                                                                                                                                                              ",
        ">                                                                     $                                                                                                                                                    =$                                ==          =                                                         * $ *=                                                                                                              -        -       =      -             -                     -                   -                                                                                      ",
        ">                                                                                                                                                                                                                          =     ======  ====  =====  ======  ==   =======                                                         =*  *=                                                                                          =                                                            =                                                                  -                                               -          ",
        ">                                                                     =                                                                                                                                                    =   ===    =  =  =  =   =  =    ==  == ==                                                               =*   =                                                                                             =                      -                                                                                                                      -                             - -         ",
        ">                                                                                                                                                                                                                          =    $=    ====  ====   ====     ==  ===  =====  $$$  = = = = = = = = = = = = = = = = = = = = = =       =* $ =                                                                                                                    -            -          -                                       =       -            =                       =                           -          -   -        ",
        ">                                  ==        ====      ========                                                                                                                                                            =    $=                           ==  =  == *           $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $   -   = $  =                                                                                        =             -=       =        =                                               -                                        =          -                     = =                  -     -       ",
        ">                                                                                                                                                                                                                          ===   =                            ==   ==  *                                                           =* * =                                                                                                                             = -        =            =               -          -                                                                                     -       -      ",
        ">                               ==                                                                                                                                                                                         =     =                             =====   *         --------------------------------------------      =  * =                                                                                               ===                            =                            -     -  =                              -     =                      =        -         -                 -         -     ",
        ">                                                                                    =                                                                                                                                     =     =                                     *                                                           = $* =                                                                                              -              --           -              --       -                -                  -                                   -                                         -           -    ",
        ">                                                                                    =                                   =============           $$      $$      $$      $$      $$      $$      $$           ==============   ===                                     *                                                           = $* =            $      $     ******   =               $$$$$$$$$$$$$$$$$$$$$$$$$$$                -                -                            =                      =                                     -=        -                         -       =              -             -   ",
        ">                        =====                                                       =                                   =============                                                                              $$$         $=                                     *                                                           = $* =$                       -     *   =                                                         -           -=           -               -       -                                 -             -              =               --        -                            -             -   ",
        ">                   ==                                                                        $  $  $  $  $  $  $  $  $  == == == == =                                                                                           =                                     *                                                           = $* =            =      =        $ *  ==                                                        -            -=                          =                   -                                                   =        -                             -               -             -   ",
        ">       $$$        =                                                                 =                                   == == == == =                                                                        **           =======                                     *                                                           = $* ==           =      =     ** $**** ======                                                  -   =                              =                                              =                                                                          --          -             -   ",
        "                  =                                                                  =                                                                                                                                     =                                           *                                                           =                 =      =                                                                     -                          =                  =        =                                                =            =                =                                   -             -   ",
        "                               ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^                 =        ^  ^  ^  ^  ^  ^  ^  ^  ^                      -       -       -       -       -       -       -       -         ^    ========                                                                                                       =^                        ^^^^^                ^   ^^^                               ^^^                          -            =                             -                                                                                                           -             -   ",
        "_                   _                  _                  _          ~~~~~~          _                  _                  _          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~         _                  _                  _          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~          _                  _                  _                  _                 _                    =                                   -                     =                                                                                           =                _     A    ",
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
          offscreen({hide: true}),
          "lava"
        ],
        ">": () => [
          sprite("eagle"),
          area({scale: 0.9}),
          pos(-695, 10),
          scale(.3),
          eagleMovement(),
          offscreen({hide: true}),
          "eagle"
        ],
        "A": () => [
          sprite("castle"),
          area({scale: 0.2}),
          pos(-390, -100),
          anchor("bot"),
          scale(),
          offscreen({hide: true}),
          "castle"
        ],
        "$": () => [
          sprite("coin"),
          area({scale: 0.9}),
          pos(-14, 20),
          scale(.9),
          offscreen({hide: true}),
          "coin"
        ],
        "^": () => [
          sprite("spike"),
          area({scale: 0.9}),
          pos(0, -40),
          scale(1),
          anchor("bot"),
          body({isStatic: true}),
          offscreen({hide: true}),
          "spike"
        ],
        "*": () => [
          sprite("spikeblock"),
          area({scale: 0.7}),
          pos(20, -8),
          scale(2),
          offscreen({hide: true}),
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
      pos(5, -50), //starting pos: (5, -50)
      area(),
      body({jumpForce: JUMP_FORCE}),
      anchor("center"),
      doubleJump(),
      rotate(0),
      jumpSpin(1500),
      "duck",
    ])

    // Giant patrol mob
    const giant = add([
      sprite("giant"),
      pos(24500, 820),
      area({scale: 0.9}),
      scale(.8),
      mobPatrol(),
      offscreen({hide: true}),
      "giant",
    ])

    const giant2 = add([
      sprite("giant"),
      pos(25500, 820),
      area({scale: 0.9}),
      scale(.8),
      mobPatrol(),
      offscreen({hide: true}),
      "giant",
    ])
    
    // starting cloud platform
    add([
      sprite("cloud"),
      color(128, 118, 128),
      area(),
      pos(0, 0),
      anchor("center"),
      body({isStatic: true}),
      offscreen({hide: true}),
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

    // Spinning axe
    const spinAxe = (position = vec2(0), angle = 0, num = 5) => {
      const axe = add([
        pos(position),
        rotate(angle),
      ])

      for (let i = 0; i < num; i++) {
        axe.add([
          sprite("axe"),
          pos(0, i * 38),
          area({scale: 0.9}),
          scale(),
          anchor("center"),
          offscreen({hide: true}),
          "axe",
        ])
      }
      axe.onUpdate(() => {
        axe.angle += dt() * -240
      })

      return axe;
    }
    
    spinAxe(vec2(15400, 10), -180)
    spinAxe(vec2(15000, 10), -120)
    spinAxe(vec2(14600, 10), -60)
    spinAxe(vec2(21200, 850), -60)
    // death wheel
    spinAxe(vec2(22047, 780), -60)
    spinAxe(vec2(22047, 780), -180)
    spinAxe(vec2(22047, 780), -300)

    // flying sharks
    const spawnShark = () => {
      add([
        sprite("shark"),
        area({scale: 0.9}),
        move(LEFT, rand(500, 1800)),
        pos(39000, rand(height())),
        scale(.24),
        offscreen({hide: true}),
        "shark",
      ])
      wait(rand(2, 5), spawnShark)
    }
    
    spawnShark();

    // // bombs dropping from sky
    const spawnBomb = () => {
      add([
        sprite("bomb"),
        area({scale: 0.9}),
        move(DOWN, rand(400, 900)),
        pos(rand(duck.pos.x - 500, duck.pos.x + 1800), 0),
        scale(.5),
        offscreen({destroy: true}),
        "bomb",
      ])
      wait(rand(.5, 1.5), spawnBomb)
    }
    
    wait(4, spawnBomb);

    // Confetti
    const DEF_COUNT = 80
    const DEF_GRAVITY = 800
    const DEF_AIR_DRAG = 0.9
    const DEF_VELOCITY = [1000, 4000]
    const DEF_ANGULAR_VELOCITY = [-200, 200]
    const DEF_FADE = 0.2
    const DEF_SPREAD = 40
    const DEF_SPIN = [2, 8]
    const DEF_SATURATION = 2
    const DEF_LIGHTNESS = 0.5

    const addConfetti = (opt = {}) => {
      const sample = (s) => typeof s === "function" ? s() : s
      for (let i = 0; i < (opt.count ?? DEF_COUNT); i++) {
        const p = add([
          pos(38070, 800),
          choose([
            rect(rand(5, 20), rand(5, 20)),
            circle(rand(3, 10)),
          ]),
          color(sample(opt.color ?? hsl2rgb(rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS))),
          opacity(1),
          lifespan(5),
          scale(.6),
          anchor("center"),
          rotate(rand(0, 360)),
          offscreen({hide: true}),
        ])
        const spin = rand(DEF_SPIN[0], DEF_SPIN[1])
        const gravity = opt.gravity ?? DEF_GRAVITY
        const airDrag = opt.airDrag ?? DEF_AIR_DRAG
        const heading = sample(opt.heading ?? 0) - 90
        const spread = opt.spread ?? DEF_SPREAD
        const head = heading + rand(-spread / 2, spread / 2)
        const fade = opt.fade ?? DEF_FADE
        const vel = sample(opt.velocity ?? rand(DEF_VELOCITY[0], DEF_VELOCITY[1]))
        let velX = Math.cos(deg2rad(head)) * vel
        let velY = Math.sin(deg2rad(head)) * vel
        const velA = sample(opt.angularVelocity ?? rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]))
        p.onUpdate(() => {
          velY += gravity * dt()
          p.pos.x += velX * dt()
          p.pos.y += velY * dt()
          p.angle += velA * dt()
          p.opacity -= fade * dt()
          velX *= airDrag
          velY *= airDrag
          p.scale.x = wave(-1, 1, time() * spin)
        })
      }
      wait(2, addConfetti)
    }

    addConfetti()
    
    // Start
    delay.wait(3, () => {
      add([
        text("RUN FAST!", {
          size: 40,
      }),
      color(255, 0, 0),
      pos(-70, 650),
      lifespan(3, {fade: 0.5}),
      ])
    });

    delay.wait(3, () => {
      add([
        text("                >>>>>  >>>>>  >>>>>", {
          size: 40,
          transform: (idx) => ({
          color: hsl2rgb((time() * .6 + idx * .6) % .7, 5, 5),
        })
      }),
        pos(-30, 650),
        lifespan(3, {fade: 0.5}),
      ])
      playerControl()
    });

    // camera view
    duck.onUpdate(() => {
      // center camera to player
      if (duck.pos.x < 37650) {
        camPos(duck.pos.x + 500, 555)
        }
      })

    duck.onUpdate(() => {
      if (duck.pos.y > FALL_DEATH) {
        wait(3,() => go("lose"))
      }
    })

    // Collision
    duck.onCollide("eagle", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("lava", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("spike", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("spikeblock", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("axe", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("giant", (e, col) => {
        addKaboom(duck.pos)
        duck.destroy()
        wait(2, () => go("lose"))
      }
    )
    
    duck.onCollide("shark", () => {
      addKaboom(duck.pos)
      duck.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("bomb", (b) => {
      addKaboom(duck.pos)
      duck.destroy()
      b.destroy()
      wait(2, () => go("lose"))
    })

    duck.onCollide("castle", () => {
      go("win", timePassed, coins)
    })

    duck.onCollideUpdate("sand", (s) => {
      wait(.2, () => {
        s.move(0, 1000)
      })
    })

    // coin counter
    const coinSprite = add([
      sprite("coin"),
      anchor("topright"),
      pos(30, 10),
      scale(.6),
      fixed(),
    ])

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

    // Lose screen
    scene("lose", () => {
      setBackground(0, 0, 0);

      add([
        text("NICE TRY", {
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

      onKeyPress("y", () => go("WorldH"));
      onKeyPress("n", () => go("Lobby"));

    })

  })


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\


  scene("WorldI", () => {
      const MAX_CLOUDS = 20; // Maximum number of clouds on the screen
      const PLAYER_SPEED = 500;
      const JUMP_FORCE = 1200;
      const NUM_PLATFORMS = 6;
      const PLATFORM_HEIGHT = 200;

        let score = 0;
        let highScore = 0;
        let touchedClouds = new Set();
        let backgroundColor = [255, 140, 0]; // Orange

        setBackground(...backgroundColor); // Set initial background color to orange
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
        const ground = add([
            rect(width(), 100),
            area(),
            outline(1),
            pos(0, height() - 100),
            color(150, 75, 0),
            body({ isStatic: true }),
        ]);

        // Player
        // const playerSprite = players[playerId]?.spriteName || "duck";
        // const playerScale = playerSprite === "duck" ? 0.3 : 0.15; // Keep the original duck size, others smaller
        const duck = add([
            sprite("duck"),
            scale(.3),
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
            duck.flipX = true;
            move(-PLAYER_SPEED);
        });

        onKeyDown("right", () => {
            duck.flipX = false;
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
                            speed: rand(100, 600),
                            dir: choose([-1, 1]),
                            id: i // Assign an ID to each cloud
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

        // Background text
        const backgroundText = add([
            text("INFINITE MODE", {
                size: 100,
            }),
            color(255, 255, 255),
            pos(width() / 2, 500),
            scale(2),
            anchor("center"),
        ]);

        // Text to show when the player is colliding with the portal
        const instructionText = add([
            text("PRESS 'b' TO GO BACK TO THE LOBBY", {
                size: 24,
            }),
            pos(width() / 2, height() - 50),
            anchor("center"),
            color(255, 255, 255),
            opacity(0),
        ]);

        // Player collision with lobby portal
        let isCollidingWithPortal = false;

        duck.onCollide("portalLobby", () => {
            isCollidingWithPortal = true;
            instructionText.opacity = 1;
        });

        duck.onCollideEnd("portalLobby", () => {
            isCollidingWithPortal = false;
            instructionText.opacity = 0;
        });

        onKeyPress("b", () => {
            if (isCollidingWithPortal) {
                go("Lobby");
            }
        });

        // Player collision with clouds
        duck.onCollide("cloud", (cloud) => {
            if (!touchedClouds.has(cloud.id)) {
                score++;
                touchedClouds.add(cloud.id);

                if (score > highScore) {
                    highScore = score;
                    backgroundColor = [0, 255, 0]; // Green
                    setBackground(...backgroundColor);
                }

                if (score > 0) {
                    backgroundText.text = `YOUR SCORE: ${score}`;
                }
            }
        });

        // Player collision with ground
        duck.onCollide(ground, () => {
            touchedClouds.clear();
            backgroundText.text = `YOUR SCORE: ${score}`;
            score = 0;
            setTimeout(() => {
                backgroundText.text = "INFINITE MODE";
                setBackground(255, 140, 0); // Orange
            }, 2000);
        });
    });


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\
  

    // Second game world
    scene("World2", () => {
      setBackground(194, 197, 204)

      add([
        text("Coming soon...", {
          size: 100,
        }),
        pos(width()/2 - 350, height()/2 - 100),
        color(255, 255, 255)
      ])

      add([
        text("(Press ESC to return to Lobby)", {
          size: 30,
        }),
        pos(width()/2 - 320, height()/2 + 10),
        color(0, 0, 0)
      ])

      onKeyPress("escape", () => go("Lobby"))

    })


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\


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
      pos(1400, 350),
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
      rect(320, 120, {radius: 30}),
      pos(width()/2 + -120, height()/2 + 80),
      color(0, 0, 200),
    ])

    add([
      text(`Time: ${timePassed.toFixed(2)}s`),
      pos(width()/2 + -100, height()/2 + 100),
    ])

    add([
      text(`Coins: ${coins}/100`),
      pos(width()/2 + -100, height()/2 + 150),
    ])

    if (coins === 100) {
      add([
        text("PERFECT", {
          size: 110,
          transform: (idx) => ({
            color: hsl2rgb((time() * 0.5 + idx * .5) % .6, 7, .9)
          })
        }),
        pos(width()/2 + -180, height()/2 + 400),
      ])
    } else if (coins > 100) {
      add([
        text("SUPER PERFECT", {
          size: 90,
          transform: (idx) => ({
            color: hsl2rgb((time() * 0.5 + idx * .5) % .6, 7, .9)
          })
        }),
        pos(width()/2 + -310, height()/2 + 400),
      ])
    }
    onKeyPress("space", () => go("Lobby"))

  })

  go("Lobby")
}

// VideoGame();

export default VideoGame;