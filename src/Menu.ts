import { IDocument, Document, IntVector2 } from "./Document";
import Editor from "./Editor";
import Game from "./Game";
import { GameWithGameOver } from "./GameOver";

export default class Menu {
  menu!: HTMLElement;
  constructor() {
    let menu = document.getElementById("menu");
    if (menu == null) {
      return;
    }
    this.menu = menu;
    menu.style.visibility = "visible";
    document
      .getElementById("play-button")!
      .addEventListener("click", this.play);
    document
      .getElementById("endless-button")!
      .addEventListener("click", this.endless);
  }
  createGame = (editor: Editor) => {
    let svg = document.getElementById("svg");
    if (svg instanceof SVGSVGElement) {
      return new Game(svg, editor);
    }
  };
  play = () => {
    this.closeMenu();
    let dcm: IDocument = new Document(new IntVector2(16, 12));
    let editor = new Editor(dcm);
    let game = this.createGame(editor);
    if (game instanceof Game) {
      new GameWithGameOver(game);
    }
  };
  endless = () => {
    this.closeMenu();
    let dcm: IDocument = new Document(new IntVector2(16, 12));
    let editor = new Editor(dcm);
    this.createGame(editor);
  };
  closeMenu = () => {
    document
      .getElementById("play-button")!
      .removeEventListener("click", this.play);
    document
      .getElementById("endless-button")!
      .removeEventListener("click", this.endless);
    this.menu.style.visibility = "hidden";
  };
}
