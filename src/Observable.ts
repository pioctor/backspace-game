import { isFunction } from "util";

export interface IDisposable {
  dispose(): void;
}
export interface IObservable<T> {
  subscribe(observe: (value: T) => void): IDisposable;
  observe(observer: IObserver<T>): IDisposable;
}

export interface IObserver<T> {
  onNext(value: T): void;
}
export class Subject<T> implements IObservable<T>, IObserver<T> {
  private observers: IObserver<T>[] = [];
  subscribe(observe: (value: T) => void): IDisposable {
    return this.observe({ onNext: value => observe(value) });
  }
  observe(observer: IObserver<T>) {
    this.observers.push(observer);
    let dispose = {
      disposed: false,
      observers: this.observers,
      dispose() {
        if (!this.disposed) {
          let i = this.observers.indexOf(observer);
          this.observers.splice(i, 1);
          this.disposed = true;
        }
      }
    };
    return dispose;
  }
  onNext(value: T): void {
    this.observers.forEach(observer => {
      observer.onNext(value);
    });
  }
}

export class ObservableProperty<T> implements IObservable<T> {
  private _oldValue!: T;
  private _value!: T;
  private _subject = new Subject<T>();
  set value(value: T) {
    this._oldValue = this._value;
    this._value = value;
    this._subject.onNext(value);
  }
  get value() {
    return this._value;
  }
  get oldValue() {
    return this._oldValue;
  }
  constructor(value?: T) {
    if (value != undefined) {
      this._value = value;
    }
  }
  subscribe(observe: (value: T) => void): IDisposable {
    return this._subject.subscribe(observe);
  }
  observe(observer: IObserver<T>): IDisposable {
    return this._subject.observe(observer);
  }
}

export interface IReadOnlyObservableProperty<T> {
  readonly value: T;
  subscribe(observe: (value: T) => void): IDisposable;
  observe(observer: IObserver<T>): IDisposable;
}
