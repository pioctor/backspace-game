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

    this.document.text = this.editor.randomText(this.document.size.x * 10);

    this.updateChars();
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
  }

  updateCursor() {
    this.cursor = `<path class="cursor" stroke="#000" d="m${this.editor.cursor
      .position2D.x + 0.9},${this.editor.cursor.position2D.y *
      1.5}v1.5"></path>`;
  }

  up() {
    this.editor.up();
    this.updateCursor();
    this.render();
  }

  down() {
    this.editor.down();
    this.updateCursor();
    this.render();
  }

  left() {
    this.editor.left();
    this.updateCursor();
    this.render();
  }

  right() {
    this.editor.right();
    this.updateCursor();
    this.render();
  }

  busy = false;

  backspace() {
    if (this.busy) {
      return;
    }
    this.editor.backspace();
    this.updateChars();
    console.log(this.editor.document.text.length);
    this.next();
  }

  delete() {
    if (this.busy) {
      return;
    }
    this.editor.delete();
    this.updateChars();
    console.log(this.editor.document.text.length);
    this.next();
  }

  updateBacks(posDirs: { position: number; direction: IntVector2 }[]) {
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
  }

  next(count: number = 0) {
    this.busy = true;
    let posDirs = this.editor.findAllBacks();
    if (posDirs.length <= 0) {
      this.backs = "";
      this.render();
      this.busy = false;
      return;
    }
    this.updateBacks(posDirs);
    this.render();
    let text = this.editor.randomText(6 * posDirs.length);
    this.editor.document.text += text;

    setTimeout(() => {
      this.editor.replaceBacks(posDirs);
      this.editor.removeSpaces();
      this.updateChars();
      this.next(count + 1);
    }, 1000);
  }
}
