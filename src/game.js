import kaboom from "kaboom";
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

import { setupInfiniteWorld } from "./infinite.js";
import { setupCharacterSelection } from "./characterSelection.js";

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

const players = {}; // Ensure players is defined

// Helper function to add a player
export const addPlayer = (id, x, y, spriteName = "duck") => {
  if (players[id]) {
    destroy(players[id]);
  }

  const scaleValue = spriteName === "duck" ? 0.3 : 0.15; // Keep the original duck size, others smaller

  players[id] = add([
    sprite(spriteName),
    scale(scaleValue),
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

  const player = players[id];

  // Adding collision handlers for the player
  player.onCollide("selectable", (selection) => {
    const { spriteName } = selection;
    addPlayer(id, player.pos.x, player.pos.y, spriteName);
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

  player.onCollide("eagle", () => {
    go("lose");
  });

  player.onCollide("lava", () => {
    go("lose");
  });

  player.onCollide("spike", () => {
    go("lose");
  });

  player.onCollide("spikeblock", () => {
    go("lose");
  });

  player.onCollide("castle", () => {
    go("win");
  });

  player.onCollide("coin", (c) => {
    destroy(c);
    coins += 1;
    coinsCounter.text = coins;
  });

  player.onCollide("powerup", (a) => {
    destroy(a);
    setGravity(1000);
  });

  player.onCollide("goal", () => {
    go("win");
  });

  player.onCollide("portal", () => {
    if (levelId + 1 < LEVEL2.length) {
      go("World2", {
        levelId: levelId + 1,
        coins: coins,
      });
    } else {
      go("Lobby");
    }
  });

  // Player movement
  const PLAYER_SPEED = 500;
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
  const lobbyText = add([
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

  // Portal to start the game
  const portal = add([
    sprite("portal"),
    scale(0.6),
    pos(width() - 40, height() - 156),
    area({ scale: 0.1 }),
    body({ isStatic: true }),
    anchor("center"),
    "portal",
  ]);

  // Animated start text on the portal
  add([
    text("START", {
      size: 24,
      transform: (idx) => ({
        color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
        pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
        scale: wave(1, 1.2, time() * 3 + idx),
        angle: wave(-9, 9, time() * 3 + idx),
      }),
    }),
    pos(width() - 40, height() - 186),
    anchor("center"),
  ]);

  // Player
  const playerSprite = players[playerId]?.spriteName || "duck";
  const playerScale = playerSprite === "duck" ? 0.3 : 0.15; // Keep the original duck size, others smaller

  const duck = add([
    sprite(playerSprite),
    scale(playerScale), // Use appropriate scale
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

  // Text options when near the portal
  let choicesDisplayed = false;
  let choicesText = [];

  duck.onCollide("portal", () => {
    if (!choicesDisplayed) {
      choicesDisplayed = true;
      lobbyText.hidden = true;

      choicesText = [
        add([
          text("PRESS 's' TO START LEVEL 1", {
            size: 32,
          }),
          pos(width() / 2, height() / 2 - 60),
          anchor("center"),
          color(0, 0, 0),
        ]),
        add([
          text("PRESS 'i' TO GO TO INFINITE MODE", {
            size: 32,
          }),
          pos(width() / 2, height() / 2),
          anchor("center"),
          color(0, 0, 0),
        ]),
        add([
          text("PRESS 'c' TO SWITCH CHARACTER", {
            size: 32,
          }),
          pos(width() / 2, height() / 2 + 60),
          anchor("center"),
          color(0, 0, 0),
        ]),
      ];

      // Handle user choices
      onKeyPress("s", () => {
        go("World1", playerId);
      });

      onKeyPress("i", () => {
        go("InfiniteWorld", playerId);
      });

      onKeyPress("c", () => {
        go("CharacterSelection", playerId);
      });
    }
  });

  duck.onCollideEnd("portal", () => {
    if (choicesDisplayed) {
      choicesDisplayed = false;
      lobbyText.hidden = false;
      choicesText.forEach((choice) => destroy(choice));
    }
  });
});

// Setup other scenes
setupInfiniteWorld(players, addPlayer);
setupCharacterSelection(players, addPlayer);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \\


  // FIRST GAME WORLD
  scene("World1", () => {
    const PLAYER_SPEED = 500;
    const EAGLE_SPEED = 100;
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

    const eagleMovement = (speed = EAGLE_SPEED - 30, dir = 1) => {
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
        ">                                                                                                                                                                         ",
        ">                                                                                                                                                                         ",
        ">                        =====                                                                                                                                            ",
        ">                   ==                                                                                                                                                    ",
        ">       $$$        =                                                                                                                                                      ",
        "                  =                                                                                                                                                       ",
        "                                       ^^^^^                                                                                                                              ",
        "_                   _                  _                  _          ~~~~~~          _                  _                  _                  _                   _      A",
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
          "platform",
        ],
        "~": () => [
          sprite("lava"),
          area(),
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
          eagleMovement(),
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
          area(.9),
          pos(-14, 20),
          scale(.9),
          "coin"
        ],
        "^": () => [
          sprite("spike"),
          area(.9),
          pos(0, -40),
          scale(1),
          anchor("bot"),
          body({isStatic: true}),
          "spike"
        ],
        "*": () => [
          sprite("spikeblock"),
          area(),
          pos(),
          scale(),
          "spikeblock"
        ],
      }
    }

    const level = addLevel(LEVEL[0], levelConf);
      
    // character double jump action
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

    // Player
    const duck = add([
      sprite("duck"),
      scale(.2)  ,
      pos(0,-50),
      area(),
      body({jumpForce: JUMP_FORCE}),
      anchor("center"),
      doubleJump(),
      rotate(0),
      spin(1500),
      "duck",
    ])

    // coins counter
    const coinSprite = add([
      sprite("coin"),
      anchor("topright"),
      pos(2000, 10),
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
        duck.move(-PLAYER_SPEED, 0)
      })
      onKeyDown("right", () => {
        duck.move(PLAYER_SPEED, 0)
      })
      duck.onDoubleJump(() => {
        duck.spin()
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
      go("lose")
    })

    duck.onCollide("lava", () => {
      go("lose")
    })

    duck.onCollide("spike", () => {
      go("lose")
    })

    duck.onCollide("spikeblock", () => {
      go("lose")
    })
    
    duck.onCollide("castle", () => {
      go("win", timePassed, coins)
    })

    let coins = 0
    const coinsCounter = add([
      fixed(),
      text(coins),
      pos(2005, 10),
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
      timePassed += dt()
      clock.text = timePassed.toFixed(2)
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

    onKeyPress("space", () => go("World2"))

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

    onKeyPress("y", () => go("World1"));
    onKeyPress("n", () => go("Lobby"));

  })


  //-------------------------------------------------------------------------------------------//
  // SECOND GAME WORLD
  // Level design
  const LEVEL2 = [
    [
      ">",
      ">",
      ">",
      ">                                       #",
      ">                                                                                                                                                                                            ",
      ">                                      ==                                                                                                                  =======                           O___",
      ">",
      ">                                                                                                                                                                                                                                                                                                                                                                       ______A",
      ">            ==      =====     ===                         ====                       =====                  ==                  =",
      ">                                                                                                                                                                                                                                                                       =========                      =                    ==                     =",
      ">",
      ">     ===",
      ">                                                                                                                                                                                                                                                  =====",
      "> ==                                                                                                                                                                                      ===============                 ====",
      ">",
      ">",
      ">",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    ],
    [ 
      ">",
      ">",
      ">",
      ">                                                                                                                                                                                                                                                                                                                                          <",
      ">                                                                                                                                                                     <                                                               ====A",
      ">",
      ">                                                                                                                                                                                                                                    <                                                                <",
      ">                                                                                                                                                                                                 < ===              ===",
      ">                                                          ==                             ===                         =                       =                  =                  =",
      ">                                            <",
      ">",
      ">                                 ==",
      ">      #",
      "> =======",
      ">",
      ">",
      ">",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    ],
    [
        ">                                                                              #",
        ">                                                       ====    =========    =====",
        ">                                   ==                                                              ==             =         ==",
        ">                                                =                                                                            =",
        ">                                          =                                                                                  =",
        ">                                                  ==                                                                         =",
        ">                                                                                                                             =",
        ">                                                         ==                                                                  =",
        ">                                                                                                                             =",
        ">                                                  ==                                                                         =",
        ">                                                                                                                             =",
        ">                                             =                                                                               =",
        ">                                      =====                                                                                  =",
        ">                               ==                                                                                            =",
        ">                        =                                                                                                    =",
        "                  =                                                                                                           =",
        "                                                                                                                              =",
        "_         _         _         _         _         _         _         _         _         _         _      _     _      _     _  C_________",
    ]
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
        offscreen({hide: true}),
        "ground",
      ],
      "=": () => [
        sprite("grass"),
        area(),
        scale(1),
        anchor("bot"),
        body({isStatic: true}),
        offscreen({hide: true}),
        "platform",
      ],
      "~": () => [
        sprite("lava"),
        area(),
        scale(.5),
        anchor("bot"),
        body({isStatic: true}),
        offscreen({hide: true}),
        "lava"
      ],
      ">": () => [
        sprite("eagle"),
        area({scale: 0.9}),
        pos(-695, 10),
        scale(.3),
        eagleMovement(),
        "eagle"
      ],
      "<": () => [
        sprite("rotated-eagle"),
        area({scale: 0.9}),
        pos(-695, 10),
        scale(.3),
        aguilaMovement(),
        "aguila"
      ],
      "#": () => [
        sprite("duck"),
        area(),
        anchor("bot"),
        body(),
        offscreen({ hide: true }),
        "powerup",
      ], 
      "A": () => [
        sprite("castle"),
        area({scale: 0.2}),
        pos(100, -100),
        anchor("bot"),
        scale(),
        "castle"
      ],
      "O": () => [
        sprite("portal"),
        area({scale: 0.2}),
        pos(100, -100),
        anchor("bot"),
        scale(),
        "portal"
      ],
      "C": () => [
        sprite("castle"),
        area({scale: 0.2}),
        pos(100, -100),
        anchor("bot"),
        scale(),
        "goal"
      ],
    }
  }

  const PLAYER_SPEED = 500;
  const EAGLE_SPEED = 200;
  const JUMP_FORCE = 1000;
  const AGUILA_SPEED = 1000;

  const eagleMovement = (speed = EAGLE_SPEED, dir = 1) => {
    return {
      id: "eagleMovement",
      require: ["pos"],
      update() {
        wait(3.1, () => {this.move(speed * dir, 0)})
      }
    }
  }

  const aguilaMovement = (speed = AGUILA_SPEED, dir = -1) => {
    return {
      id: "aguilaMovement",
      require: ["pos"],
      update() {
        wait(3.1, () => {this.move(speed * dir, 0)})
      }
    }
  }

  scene("World2", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {

    // add level to scene
    const level = addLevel(LEVEL2[levelId ?? 0], levelConf)

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
      
    // character double jump action
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

    // Player
    const duck = add([
      sprite("duck"),
      scale(.2)  ,
      pos(0,-50),
      area(),
      body({jumpForce: JUMP_FORCE}),
      anchor("center"),
      doubleJump(),
      rotate(0),
      spin(1500),
      "duck",
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
        duck.move(-PLAYER_SPEED, 0)
      })
      onKeyDown("right", () => {
        duck.move(PLAYER_SPEED, 0)
      })
      duck.onDoubleJump(() => {
        duck.spin()
      })
      onKeyPress("space", () => {
        duck.doubleJump();  
      })
    }

    // Start
    delay.wait(3, () => {
      add([
        text("GO!        >>>> >>>> >>>> >>>>", {
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
      go("lose")
    })

    duck.onCollide("powerup", (a) => {
      destroy(a)
      setGravity(1000);
    })

    duck.onCollide("castle", () => {
      go("World2", {
        levelId: levelId + 2,
        coins: coins,
      })
    })

    duck.onCollide("lava", () => {
      go("lose")
    })

    duck.onCollide("aguila", () => {
      go("lose")
    })

    duck.onCollide("goal", () => {
      go("win")
    })

    duck.onCollide("portal", () => {
      if (levelId + 1 < LEVEL2.length) {
        go("World2", {
          levelId: levelId + 1,
          coins: coins,
        })
      } else {
        go("Lobby")
      }
    })

  })
  

  // Win screen
  scene("win", () => {
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
        transform: (idx, ch) => ({
          color: hsl2rgb((time() * 0.7 + idx * .2) % 1, .9, .5),
          pos: vec2(0, wave(-4, 4, time() * 10 + idx * 4))
        })
      }),
      pos(width()/2 - 280, height()/2 - 350)
    ])
    add([
      rect(270, 120, {radius: 30}),
      pos(width()/2 + -100, height()/2 + 80),
      color(0, 0, 200),
    ])
    add([
      text("Time: "),
      pos(width()/2 + -80, height()/2 + 100),
    ])
    add([
      text("Coins: "),
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

    onKeyPress("y", () => go("World2"));
    onKeyPress("n", () => go("Lobby"));

  })

 
  go("Lobby");



// VideoGame();

export default VideoGame;