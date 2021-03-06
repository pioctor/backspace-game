import Editor, { Cursor } from "./Editor";
import * as Document from "./Document";
import { IntVector2 } from "./Document";
import { characters, space } from "./Characters";
import Result from "./Result";
import { volume } from "./app";

export default class Game {
  editorSvg: SVGSVGElement;
  editor: Editor;
  charG: SVGGElement;
  cursorG: SVGGElement;
  backsG: SVGGElement;
  constructor(editorSvg: SVGSVGElement, editor: Editor) {
    this.editor = editor;
    this.editorSvg = editorSvg;
    this.editor.characters = Object.keys(characters);
    this.editorSvg.setAttribute("width", `${this.editor.document.size.x * 30}`);
    this.editorSvg.setAttribute(
      "height",
      `${this.editor.document.size.y * 30 * 1.5}`
    );
    this.editorSvg.setAttribute(
      "viewBox",
      `-0.2 0 ${this.editor.document.size.x + 0.3} ${this.editor.document.size
        .y * 1.5}`
    );

    this.charG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.charG.setAttribute("class", "character");
    this.cursorG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.backsG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.editorSvg.innerHTML = `<rect class="rect" x="-0.05" width="${this
      .editor.document.size.x + 0.05}" height="${this.editor.document.size.y *
      1.5}"></rect>`;
    this.editorSvg.appendChild(this.charG);
    this.editorSvg.appendChild(this.cursorG);
    this.editorSvg.appendChild(this.backsG);

    this.editor.document.observableText.subscribe(_ => this.updateChars());
    this.editor.cursor.observablePosition.subscribe(_ => this.updateCursor());
    this.editor.backs.subscribe(backs => this.updateBacks());
    this.editor.score.subscribe(_ => this.updateScore());

    this.editor.document.text = this.editor.randomText(
      this.editor.document.size.x * this.editor.document.size.y
    );
    this.updateCursor();
    this.updateScore();

    this.initializeSound();

    this.addEventListeners();

    this.editor.gameOverAsObservable.subscribe(() => {
      this.onGameOver();
    });
  }

  onGameOver() {
    this.removeEventListeners();
    new Result(this.editor.score.value);
  }

  addEventListeners() {
    addEventListener("keydown", this.onKeyDown);
  }

  removeEventListeners = () => {
    removeEventListener("keydown", this.onKeyDown);
  };

  onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 38: //up
        event.preventDefault();
        this.editor.up();
        break;
      case 40: //down
        event.preventDefault();
        this.editor.down();
        break;
      case 37: //left
        event.preventDefault();
        this.editor.left();
        break;
      case 39: //right
        event.preventDefault();
        this.editor.right();
        break;
      case 8: //backspace
        event.preventDefault();
        this.editor.backspace();
        break;
      case 46:
        this.editor.delete();
    }
  };

  initializeSound() {
    let audioContext = new AudioContext();
    let playing: OscillatorNode;
    let play = (
      length = 1,
      gain = 1,
      frequency = 440,
      type: OscillatorType = "sine"
    ) => {
      let t = audioContext.currentTime;
      let osc = new OscillatorNode(audioContext);
      let gainNode = new GainNode(audioContext);
      gainNode.gain.value = gain * volume.volume;
      osc.frequency.value = frequency;
      osc.type = type;
      osc.connect(gainNode).connect(audioContext.destination);
      osc.start(t);
      osc.stop(t + length);
      playing = osc;
    };
    this.editor.cursorMoveAsObservable.subscribe(_ => {
      play(0.05, 0.5, 440, "triangle");
    });
    this.editor.deleteAndBackspaceAsObservable.subscribe(_ => {
      play(0.05, 0.1, 770, "square");
    });
    this.editor.backAsObservable.subscribe(value => {
      play(0.3, 1, 440 * Math.pow(1.06, value.combo), "sine");
    });
  }

  updateChars() {
    let html = [];
    let c = new Cursor(this.editor.document);
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
    this.charG.innerHTML = html.join("");
  }

  updateCursor() {
    this.cursorG.innerHTML = `<path class="cursor" d="m${this.editor.cursor
      .position2D.x + 0.9},${this.editor.cursor.position2D.y *
      1.5}v1.5"></path>`;
  }

  updateScore() {
    let score = document.getElementById("score");
    if (score != null) {
      score.innerText = this.editor.score.value.toString();
    }
  }

  updateBacks() {
    let posDirs = this.editor.backs.value;
    let html = [`<g class="back-line" transform="scale(1,1)">`];
    posDirs.forEach(posDir =>
      html.push(
        `<path d="m${this.editor.document.getPosition2D(posDir.position).x +
          0.5},${(this.editor.document.getPosition2D(posDir.position).y + 0.5) *
          1.5}l${posDir.direction.x *
          (this.editor.characters.length - 1)},${posDir.direction.y *
          (this.editor.characters.length - 1) *
          1.5}"></path>`
      )
    );
    html.push(`</g>`);
    this.backsG.innerHTML = html.join("");
  }
}
