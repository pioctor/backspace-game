import Editor, { Cursor } from "./Editor";
import * as Document from "./Document";
import { IntVector2 } from "./Document";
import { characters, space } from "./characters";

export default class Game {
  editorSvg: SVGSVGElement;
  document: Document.IDocument = new Document.Document(new IntVector2(6, 10));
  editor = new Editor(this.document);
  constructor(editorSvg: SVGSVGElement) {
    this.editorSvg = editorSvg;
    this.editor.characters = Object.keys(characters);
    this.editorSvg.setAttribute("width", `${this.editor.document.size.x * 30}`);
    this.editorSvg.setAttribute(
      "height",
      `${this.editor.document.size.y * 70}`
    );
    this.editorSvg.setAttribute(
      "viewBox",
      `0 0 ${this.editor.document.size.x * 1.3} ${this.editor.document.size.y}`
    );

    this.editor.document.observableText.subscribe(_ => this.updateChars());
    this.editor.cursor.observablePosition.subscribe(_ => this.updateCursor());
    this.editor.backs.subscribe(backs => this.updateBacks());

    this.document.text = this.editor.randomText(this.document.size.x * 10);
    this.updateCursor();
    this.render();
  }
  chars: string = "";
  cursor: string = "";
  backs: string = "";

  render() {
    let html = [
      `<g transform="translate(${this.editor.document.size.x * 0.2},0)">`
    ];
    html.push(
      `<rect x="-0.05" width="${this.editor.document.size.x +
        0.05}" height="${this.editor.document.size.y *
        1.5}" fill="none" stroke="#000" stroke-width="0.05"></rect>`
    );

    html.push(this.chars);
    html.push(this.cursor);
    html.push(this.backs);
    html.push(`</g>`);
    this.editorSvg.innerHTML = html.join("");
  }

  updateChars() {
    let html = [];
    let c = new Cursor(this.document);
    c.position = 0;
    while (!c.isOut) {
      try {
        html.push(
          characters[c.character].getView(c.position2D.x, c.position2D.y * 1.5)
        );
      } catch {
        html.push(space.getView(c.position2D.x, c.position2D.y * 1.5));
      }
      c.forceSet(c.position + 1);
    }
    this.chars = html.join("");
    this.render();
  }

  updateCursor() {
    this.cursor = `<path class="cursor" stroke="#000" d="m${this.editor.cursor
      .position2D.x + 0.9},${this.editor.cursor.position2D.y *
      1.5}v1.5"></path>`;
    this.render();
  }

  up() {
    this.editor.up();
  }

  down() {
    this.editor.down();
  }

  left() {
    this.editor.left();
  }

  right() {
    this.editor.right();
  }

  backspace() {
    this.editor.backspace();
  }

  delete() {
    this.editor.delete();
  }

  updateBacks() {
    let posDirs = this.editor.backs.value;
    let html = [
      `<g transform="scale(1,1.5)" stroke="#000" stroke-width="0.1">`
    ];
    posDirs.forEach(posDir =>
      html.push(
        `<path d="m${this.document.getPosition2D(posDir.position).x +
          0.5},${this.document.getPosition2D(posDir.position).y + 0.5}l${posDir
          .direction.x *
          (this.editor.characters.length - 1)},${posDir.direction.y *
          (this.editor.characters.length - 1)}"></path>`
      )
    );
    html.push(`</g>`);
    this.backs = html.join("");
    this.render();
  }
}
