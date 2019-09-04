import { IntVector2 } from "./Game";

export interface IDocument {
  size: IntVector2;
  text: string;
  text2D: string[];
  isOutOfDocument(position: number): boolean;
  getPosition2D(position: number): IntVector2;
  getPosition(position2D: IntVector2): number;
}
