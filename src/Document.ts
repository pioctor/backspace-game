export class IntVector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
  }
  add(operand: IntVector2): IntVector2 {
    return new IntVector2(this.x + operand.x, this.y + operand.y);
  }
}

export interface IDocument {
  size: IntVector2;
  text: string;
  text2D: string[];
  isOutOfDocument(position: number): boolean;
  isOutOfDocument2D(position2D: IntVector2): boolean;
  getPosition2D(position: number): IntVector2;
  getPosition(position2D: IntVector2): number;
}

export class Document implements IDocument {
  size: IntVector2;
  text: string = "";
  constructor(size: IntVector2) {
    this.size = size;
  }
  get text2D(): string[] {
    let t = [];
    for (let i = 0; i < this.size.y; i += this.size.x) {
      let line = this.text.slice(i, i + this.size.x - 1);
      t.push(line);
    }
    return t;
  }
  isOutOfDocument(position: number): boolean {
    return position < 0 || this.size.x * this.size.y <= position;
  }
  isOutOfDocument2D(position2D: IntVector2) {
    return (
      position2D.x < 0 ||
      position2D.y < 0 ||
      this.size.x <= position2D.x ||
      this.size.y <= position2D.y
    );
  }
  getPosition2D(position: number): IntVector2 {
    return new IntVector2(position % this.size.x, position / this.size.x);
  }
  getPosition(position2D: IntVector2): number {
    return position2D.x + position2D.y * this.size.x;
  }
}
