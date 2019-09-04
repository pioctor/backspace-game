import { IDocument, IntVector2 } from "./Document";

class Cursor {
  document!: IDocument;
  private _position = 0;
  constructor(document: IDocument) {
    this.document = document;
  }
  set position(position: number) {
    if (this.document.isOutOfDocument(position)) {
      return;
    }
    this._position = position;
  }
  get position() {
    return this._position;
  }
  set character(character: string) {
    this.document.text =
      this.document.text.slice(0, this.position - 1) +
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
    return this.document.getPosition2D(this.position);
  }
  move(direction: IntVector2) {
    this.position2D = this.position2D;
  }
  backspace() {
    this.document.text =
      this.document.text.slice(0, this.position - 1) +
      this.document.text.slice(this.position + 1);
  }
}
