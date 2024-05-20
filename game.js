// game.js
import kaboom from "kaboom";




const runGame = () => {
  kaboom();
  // Example: Add a piece of text
  add([text("Hello, Kaboom!"), pos(120, 80)]);
}

export default runGame