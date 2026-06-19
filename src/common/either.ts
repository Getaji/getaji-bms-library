export class Either<L, R> {
  private constructor(
    private _left: L,
    private _right: R,
    readonly isRight: boolean,
  ) {}

  get left() {
    if (this.isRight) {
      throw new Error("This Either is 'right'.");
    }

    return this._left;
  }

  get right() {
    if (this.isLeft) {
      throw new Error("This Either is 'left'.");
    }

    return this._right;
  }

  get isLeft() {
    return !this.isRight;
  }

  use<T>(fn: (either: Either<L, R>) => T) {
    return fn(this);
  }

  useRight(fn: (value: R) => R) {
    if (this.isRight) {
      return fn(this.right);
    }
  }

  mapRight<NewR>(
    right: ((rightValue: R) => NewR | Either<L, NewR>) | Either<unknown, NewR>,
  ): Either<L, NewR> {
    if (this.isLeft) {
      return Either.left<L, NewR>(this.left);
    }

    if (typeof right === "function") {
      const result = right(this.right);

      if (result instanceof Either) {
        return result;
      }

      return Either.right<L, NewR>(result);
    }

    return Either.right<L, NewR>(right.right);
  }

  mapLeft<NewL>(
    left: ((leftValue: L) => NewL | Either<NewL, R>) | Either<NewL, unknown>,
  ): Either<NewL, R> {
    if (this.isRight) {
      return Either.right<NewL, R>(this.right);
    }

    if (typeof left === "function") {
      const result = left(this.left);

      if (result instanceof Either) {
        return result;
      }

      return Either.left<NewL, R>(result);
    }

    return Either.left<NewL, R>(left.left);
  }

  nullishRight(): Either<null, Exclude<R, null>> {
    if (this.isLeft) return Either.left(null);

    if (this.right === null) {
      return Either.left(null);
    }

    return Either.right(this.right as Exclude<R, null>);
  }

  get(): L | R {
    return this.isLeft ? this.left : this.right;
  }

  static right<L, R>(right: R) {
    return new Either(null as L, right, true);
  }

  static left<L, R>(left: L) {
    return new Either(left, null as R, false);
  }

  static async promise<L, R>(promise: Promise<R>): Promise<Either<L, R>> {
    try {
      const value = await promise;
      return Either.right<L, R>(value);
    } catch (reason) {
      return Either.left<L, R>(reason as L);
    }
  }

  static createFactory<L, R>() {
    return {
      right: (right: R) => Either.right<L, R>(right),
      left: (left: L) => Either.left<L, R>(left),
    } as {
      right: (right: R, left?: L) => Either<L, R>;
      left: (left: L, right?: R) => Either<L, R>;
    };
  }
}

export function nullishEither<T>(value: T): Either<null, Exclude<T, null>> {
  return value === null
    ? Either.left(null)
    : Either.right(value as Exclude<T, null>);
}

export function tryToEither<Error, Value>(
  fn: () => Value,
): Either<Error, Value> {
  try {
    return Either.right<Error, Value>(fn());
  } catch (e) {
    return Either.left<Error, Value>(e as Error);
  }
}

export function uniteEither<T>(either: Either<T, T>): T {
  return either.isLeft ? either.left : either.right;
}
