import Editor from "./Editor";
import Game from "./Game";
import { Document, IDocument, IntVector2 } from "./Document";
import { GameWithGameOver } from "./GameOver";
import Menu from "./Menu";

export default class Result {
  score: number;
  view: HTMLElement | null;
  constructor(score: number) {
    this.score = score;
    this.view = document.getElementById("result");
    if (this.view == null) {
      return;
    }
    this.view!.style.visibility = "visible";
    document
      .getElementById("replay-button")!
      .addEventListener("click", this.play);
    document
      .getElementById("menu-button")!
      .addEventListener("click", this.menu);
  }
  createGame = (editor: Editor) => {
    let svg = document.getElementById("svg");
    if (svg instanceof SVGSVGElement) {
      return new Game(svg, editor);
    }
  };
  play = () => {
    this.closeResult();
    let dcm: IDocument = new Document(new IntVector2(16, 12));
    let editor = new Editor(dcm);
    let game = this.createGame(editor);
    if (game instanceof Game) {
      new GameWithGameOver(game);
    }
  };
  menu = () => {
    this.closeResult();
    new Menu();
  };
  closeResult = () => {
    document
      .getElementById("replay-button")!
      .removeEventListener("click", this.play);
    document
      .getElementById("menu-button")!
      .removeEventListener("click", this.menu);
    this.view!.style.visibility = "hidden";
  };
}
