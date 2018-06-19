export declare type Expression<T> = (t: T) => any;
export declare type LambdaExpression<T> = (t: T) => boolean;
export declare type WhereExpression<T> = (t: T, index: number) => boolean;
export declare type ValueExpression<T> = (t: T) => any;
export declare type ReturnExpression<TReturn, T> = (t: T) => TReturn;
export declare type DoubleExpression<TReturn, A, B> = (a: A, b: B) => TReturn;

export interface Group<K, V> {
  key: K;
  group: V[];
}

export enum Order {
  ASC,
  DESC
}
