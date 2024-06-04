import kaboom from "kaboom";

export const setupCharacterSelection = (players, addPlayer) => {
  scene("CharacterSelection", (playerId) => {
    setBackground(135, 206, 235);

    add([
      text("Choose Your Character", { size: 48 }),
      pos(width() / 2, 100),
      anchor("center"),
    ]);

    const duck3 = add([
      sprite("duck3"),
      scale(0.15), // Make the selectable ducks smaller
      pos(width() / 2 - 200, height() / 2),
      area(),
      anchor("center"),
      "selectable",
      { spriteName: "duck3" },
    ]);

    const duck4 = add([
      sprite("duck4"),
      scale(0.15), // Make the selectable ducks smaller
      pos(width() / 2 + 200, height() / 2),
      area(),
      anchor("center"),
      "selectable",
      { spriteName: "duck4" },
    ]);

    if (!players[playerId]) {
      addPlayer(playerId, width() / 2, height() - 150, "duck");
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

    // Text for custom portal
    add([
      text("Custom", {
        size: 17,
        transform: (idx) => ({
          color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
          pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
          scale: wave(1, 1.2, time() * 3 + idx),
          angle: wave(-9, 9, time() * 3 + idx),
        }),
      }),
      pos(width() - 100, height() - 150),
      scale(1),
      anchor("center"),
    ]);
  });
};