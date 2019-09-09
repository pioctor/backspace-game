import Game from "./Game";
import Editor from "./Editor";
import {
  ObservableProperty,
  Subject,
  IObservable,
  IDisposable
} from "./Observable";
import Result from "./Result";

export class GameWithGameOver {
  game: Game;
  gameOver: GameOver;
  top: HTMLElement | null;
  left: HTMLElement;
  constructor(game: Game) {
    this.game = game;
    this.gameOver = new GameOver(this.game.editor);
    this.gameOver.left.subscribe(_ => this.renderLeft());
    this.top = document.getElementById("top");
    this.left = document.createElement("div");
    this.gameOver.gameOverAsObservable.subscribe(_ => this.onGameOver());
    if (this.top != null) {
      this.top.appendChild(this.left);
    }
    this.renderLeft();
  }

  renderLeft() {
    this.left.innerHTML = `left:${this.gameOver.left.value}`;
  }

  onGameOver() {
    this.top!.removeChild(this.left);
    this.game.onGameOver();
  }
}

class GameOver {
  left = new ObservableProperty(12);
  editor: Editor;
  timer = new Timer(10000);

  private _gameOverSubject = new Subject<void>();
  gameOverAsObservable: IObservable<void> = this._gameOverSubject;

  constructor(editor: Editor) {
    this.editor = editor;
    this.editor.deleteAndBackspaceAsObservable.subscribe(_ => {
      this.decrement();
      this.timer.restart();
    });
    this.editor.backAsObservable.subscribe(v => {
      if (v.combo == 0 || v.combo > 5 || v.count > 5) {
        this.increment();
      }
    });
    this.left.subscribe(v => {
      if (v <= 0) {
        this._gameOverSubject.onNext();
      }
    });
    this.editor.busy.subscribe(v => {
      if (v) {
        this.timer.stop();
      } else {
        this.timer.start();
      }
    });
    this.timer.OnLimitAsObservable.subscribe(_ => {
      this.decrement();
      this.timer.restart();
    });
    this.timer.start();
  }

  decrement() {
    this.left.value--;
  }

  increment() {
    this.left.value++;
  }
}

class Timer implements IDisposable {
  time = new ObservableProperty(0);
  limit = new ObservableProperty(10000);
  stopped = new ObservableProperty(true);
  alerted = false;
  interval: NodeJS.Timeout;
  private _OnLimitSubject = new Subject<void>();
  OnLimitAsObservable: IObservable<void> = this._OnLimitSubject;
  constructor(limit: number) {
    this.limit.value = limit;
    this.interval = setInterval(() => {
      if (!this.stopped.value) {
        this.time.value += 20;
        if (!this.alerted && this.time.value >= this.limit.value) {
          this.alerted = true;
          this._OnLimitSubject.onNext();
        }
      }
    }, 20);
  }

  stop() {
    this.stopped.value = true;
    this.time.value = 0;
    this.alerted = false;
  }

  pause() {
    this.stopped.value = true;
  }

  restart() {
    this.time.value = 0;
    this.alerted = false;
  }

  start() {
    this.stopped.value = false;
  }

  dispose() {
    clearInterval(this.interval);
  }
}
