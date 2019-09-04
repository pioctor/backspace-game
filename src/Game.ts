export class IntVector2 {
  x!: number;
  y!: number;
  constructor(x: number, y: number) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
  }
}
