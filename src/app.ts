import { IntVector2 } from "./Document";
import Game from "./Game";

let isSvgSvg = (item: any): item is SVGSVGElement =>
  item instanceof SVGSVGElement;

let svg = document.getElementById("svg");
if (isSvgSvg(svg)) {
  let game = new Game(svg);
  document.addEventListener("keydown", event => {
    switch (event.keyCode) {
      case 38: //up
        game.up();
        console.log("up");
        break;
      case 40: //down
        game.down();
        break;
      case 37: //left
        game.left();
        break;
      case 39: //right
        game.right();
        break;
      case 8: //backspace
        game.backspace();
        break;
      case 46:
        game.delete();
    }
  });
}
