import { IDocument, IntVector2 } from "./Document";
import { randomBytes } from "crypto";

export class Cursor {
  document: IDocument;
  private _position = 0;
  constructor(document: IDocument) {
    this.document = document;
    this._position = 0;
  }
  set position(position: number) {
    if (position != -1 && this.document.isOutOfDocument(position)) {
      return;
    }
    if (position >= this.document.text.length) {
      return;
    }
    this._position = position;
  }
  get position() {
    return this._position;
  }
  set character(character: string) {
    this.document.text =
      this.document.text.slice(0, this.position) +
      character +
      this.document.text.slice(this.position + 1);
  }
  get character() {
    return this.document.text[this.position];
  }
  set position2D(position2D: IntVector2) {
    this.position = this.document.getPosition(position2D);
  }
  get position2D() {
    if (this.position == -1) {
      return new IntVector2(-1, 0);
    }
    return this.document.getPosition2D(this.position);
  }
  move(direction: IntVector2) {
    let pos = this.position2D.add(direction);
    this.position2D = pos;
  }
  get isOut() {
    return this.document.isOutOfDocument(this.position);
  }
  forceMove(direction: IntVector2) {
    let pos = this.position2D.add(direction);
    this._position = this.document.getPosition(pos);
  }
  forceSet(position: number) {
    this._position = position;
  }
  backspace() {
    if (this.position < 0) {
      return;
    }
    this.document.text =
      this.document.text.slice(0, this.position) +
      this.document.text.slice(this.position + 1);
    this.position--;
  }
  delete() {
    this.document.text =
      this.document.text.slice(0, this.position + 1) +
      this.document.text.slice(this.position + 2);
  }
}

let IntRandom = (n: number): number => {
  return Math.floor(Math.random() * n);
};

export default class Editor {
  document: IDocument;
  cursor: Cursor;
  characters!: string[];
  constructor(document: IDocument) {
    this.document = document;
    this.cursor = new Cursor(this.document);
  }

  up() {
    this.cursor.move(new IntVector2(0, -1));
  }
  down() {
    this.cursor.move(new IntVector2(0, 1));
  }
  left() {
    this.cursor.position--;
  }
  right() {
    this.cursor.position++;
  }
  backspace() {
    this.cursor.backspace();
    //this.document.text += this.characters[IntRandom(this.characters.length)];
  }

  delete() {
    this.cursor.delete();
  }

  findBacks(direction: IntVector2): number[] {
    if (direction.x == 0 && direction.y == 0) {
      return [];
    }
    let p = 0;
    let c = new Cursor(this.document);

    let result: number[] = [];

    while (!c.isOut) {
      let find = this.characters.every((char, index) => {
        let r = !c.isOut && char == c.character;
        if (
          this.document.isOutOfDocument2D(c.position2D.add(direction)) &&
          index < this.characters.length - 1
        ) {
          return false;
        }
        c.move(direction);
        return r;
      });
      if (find) {
        result.push(p);
      }
      p++;
      c.forceSet(p);
    }
    return result;
  }
  findAllBacks(): { position: number; direction: IntVector2 }[] {
    let pos_dirs: { position: number; direction: IntVector2 }[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let direction = new IntVector2(i, j);
        this.findBacks(direction)
          .map(position => {
            return { position: position, direction: direction };
          })
          .forEach(pos_dir => pos_dirs.push(pos_dir));
      }
    }

    return pos_dirs;
  }
  replaceBacks(pos_dirs: { position: number; direction: IntVector2 }[]) {
    let c = new Cursor(this.document);
    pos_dirs.forEach(value => {
      c.position = value.position;
      this.characters.forEach(char => {
        c.character = " ";
        c.move(value.direction);
      });
    });
  }
  removeSpaces() {
    this.document.text = this.document.text.replace(/ /g, "");
  }
  randomCharacter() {
    return this.characters[IntRandom(this.characters.length)];
  }
  randomText(length: number) {
    let sb = [];
    for (let i = 0; i < length; i++) {
      sb.push(this.randomCharacter());
    }
    return sb.join("");
  }
}
