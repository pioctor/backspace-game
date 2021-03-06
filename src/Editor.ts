import { IDocument, IntVector2 } from "./Document";
import { randomBytes } from "crypto";
import {
  ObservableProperty,
  IObservable,
  Subject,
  IReadOnlyObservableProperty
} from "./Observable";

export class Cursor {
  document: IDocument;
  observablePosition = new ObservableProperty(0);
  private set _position(value: number) {
    this.observablePosition.value = value;
  }
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
    return this.observablePosition.value;
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

export class PosDir {
  position: number;
  direction: IntVector2;
  constructor(position: number, direction: IntVector2) {
    this.position = position;
    this.direction = direction;
  }
}

export default class Editor {
  document: IDocument;
  cursor: Cursor;
  characters!: string[];
  constructor(document: IDocument) {
    this.document = document;
    this.cursor = new Cursor(this.document);
  }
  private _score = new ObservableProperty(0);
  score = this._score as IReadOnlyObservableProperty<number>;
  private _addScoreSubject = new Subject<number>();
  addScoreAsObservable: IObservable<number> = this._addScoreSubject;

  addScore(value: number) {
    this._score.value += value;
    this._addScoreSubject.onNext(value);
  }

  private _cursorMoveSubject = new Subject<number>();
  cursorMoveAsObservable: IObservable<number> = this._cursorMoveSubject;

  private _deleteAndBackspaceSubject = new Subject<void>();
  deleteAndBackspaceAsObservable: IObservable<void> = this
    ._deleteAndBackspaceSubject;

  private _backSubject = new Subject<{ count: number; combo: number }>();
  backAsObservable: IObservable<{ count: number; combo: number }> = this
    ._backSubject;

  private _gameOverSubject = new Subject<void>();
  gameOverAsObservable: IObservable<void> = this._gameOverSubject;

  private _endNextSubject = new Subject<number>();
  endNextAsObservable: IObservable<number> = this._endNextSubject;

  up() {
    this.cursor.move(new IntVector2(0, -1));
    this._cursorMoveSubject.onNext(this.cursor.position);
  }
  down() {
    this.cursor.move(new IntVector2(0, 1));
    this._cursorMoveSubject.onNext(this.cursor.position);
  }
  left() {
    this.cursor.position--;
    this._cursorMoveSubject.onNext(this.cursor.position);
  }
  right() {
    this.cursor.position++;
    this._cursorMoveSubject.onNext(this.cursor.position);
  }
  backspace() {
    if (this.busy.value) return;
    this.cursor.backspace();
    this._deleteAndBackspaceSubject.onNext();
    this.document.text += this.randomCharacter();
    this.next();
  }

  delete() {
    if (this.busy.value) return;
    this.cursor.delete();
    this._deleteAndBackspaceSubject.onNext();
    this.document.text += this.randomCharacter();
    this.next();
  }
  busy = new ObservableProperty<boolean>(false);
  backs = new ObservableProperty<PosDir[]>([]);

  next(combo: number = 0) {
    this.busy.value = true;
    this.backs.value = this.findAllBacks();
    if (this.backs.value.length <= 0) {
      this.backs.value = [];
      this.busy.value = false;
      this._endNextSubject.onNext(combo);
      return;
    }
    this.addScore(this.backs.value.length * (combo + 10));
    this._backSubject.onNext({ count: this.backs.value.length, combo: combo });
    let text = this.randomText(4 * this.backs.value.length);
    this.document.text += text;

    setTimeout(() => {
      this.replaceBacks();
      this.removeSpaces();
      this.next(combo + 1);
    }, 300);
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
  findAllBacks(): PosDir[] {
    let pos_dirs: PosDir[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let direction = new IntVector2(i, j);
        this.findBacks(direction)
          .map(position => {
            return new PosDir(position, direction);
          })
          .forEach(pos_dir => pos_dirs.push(pos_dir));
      }
    }

    return pos_dirs;
  }
  replaceBacks(pos_dirs?: PosDir[]) {
    if (pos_dirs == undefined) {
      pos_dirs = this.backs.value;
    }
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
