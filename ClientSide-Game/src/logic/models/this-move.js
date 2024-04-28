class ThisMove {
  constructor() {
    this._fromBarIdx = -1;
    this._toBarIdx = -1;
    this._canGoTo = [];
  }

  static new() {
    return new ThisMove();
  }

  get fromBarIdx() {
    return this._fromBarIdx;
  }
  set fromBarIdx(value) {
    this._fromBarIdx = value;
  }

  get toBarIdx() {
    return this._toBarIdx;
  }
  set toBarIdx(value) {
    this._toBarIdx = value;
  }

  get canGoTo() {
    return this._canGoTo;
  }
  set canGoTo(value) {
    this._canGoTo = value;
  }

  clone() {
    const newThisMove = new ThisMove();
    newThisMove.fromBarIdx = this._fromBarIdx;
    newThisMove.toBarIdx = this._toBarIdx;
    newThisMove.canGoTo = [...this._canGoTo];

    return newThisMove;
  }
}

export default ThisMove;