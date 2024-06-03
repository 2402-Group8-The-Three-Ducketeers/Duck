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

        // Lobby portal
        const portalLobby = add([
            sprite("portal"),
            scale(0.6),
            pos(width() - 400, height() - 156),
            area({ scale: 0.1 }),
            body({ isStatic: true }),
            anchor("center"),
            "portalLobby",
        ]);

        // Lobby portal text
        add([
            text("Lobby", {
                size: 17,
                transform: (idx) => ({
                    color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
                    pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
                    scale: wave(1, 1.2, time() * 3 + idx),
                    angle: wave(-9, 9, time() * 3 + idx),
                }),
            }),
            pos(width() - 400, height() - 156),
            scale(1),
            anchor("center"),
        ]);

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

    go("InfiniteWorld");
}