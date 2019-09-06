interface IDisposable {
  dispose(): void;
}
export class ObservableProperty<T> {
  private _value: T;
  private observes: ((value: T) => void)[] = [];
  set value(value: T) {
    this._value = value;
    this.observes.forEach(value => value(this.value));
  }
  get value() {
    return this._value;
  }
  constructor(value: T) {
    this._value = value;
  }
  subscribe(observe: (value: T) => void): IDisposable {
    this.observes.push(observe);
    let dispose = {
      disposed: false,
      observes: this.observes,
      dispose() {
        if (!this.disposed) {
          this.observes.indexOf(observe);
          this.disposed = true;
        }
      }
    };
    return dispose;
  }
}
