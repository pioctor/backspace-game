export class IntVector2 {
  x!: number;
  y!: number;
  constructor(x: number, y: number) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
  }
}

export interface IDocument {
  size: IntVector2;
  text: string;
  text2D: string[];
  isOutOfDocument(position: number): boolean;
  getPosition2D(position: number): IntVector2;
  getPosition(position2D: IntVector2): number;
}

class Document implements IDocument {
  size!: IntVector2;
  text: string = "";
  get text2D(): string[] {
    let t = [];
    for (let i = 0; i < this.size.y; i += this.size.x) {
      let ty = this.text.slice(i, i + this.size.x - 1);
      t.push(ty);
    }
    return t;
  }
  isOutOfDocument(position: number): boolean {
    return position < 0 || this.size.x * this.size.y <= position;
  }
  getPosition2D(position: number): IntVector2 {
    return new IntVector2(position % this.size.y, position / this.size.x);
  }
  getPosition(position2D: IntVector2): number {
    return position2D.x + position2D.y * this.size.x;
  }
}
