import { IntVector2, Document } from "./Document";
import Game from "./Game";
import Editor from "./Editor";

let isSvgSvg = (item: any): item is SVGSVGElement =>
  item instanceof SVGSVGElement;

let svg = document.getElementById("svg");
if (isSvgSvg(svg)) {
  let doc = new Document(new IntVector2(10, 10));
  let editor = new Editor(doc);
  let game = new Game(svg, editor);
  document.addEventListener("keydown", event => {
    switch (event.keyCode) {
      case 38: //up
        game.up();
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
