import { LambdaExpression, ValueExpression, ReturnExpression, Group, Expression, Order } from './types';

export interface Queryable<T> {
  where(expression: LambdaExpression<T>): Queryable<T>;

  select(expression: ValueExpression<T>): Queryable<T>;

  asc(expression: ValueExpression<T>): Queryable<T>;

  desc(expression: ValueExpression<T>): Queryable<T>;

  order(expression: ValueExpression<T>, order: Order): Queryable<T>;

  groupBy<TKey>(expression: ReturnExpression<TKey, T>): Queryable<Group<TKey, T>>;

  min<TResult>(expression: ReturnExpression<TResult, T>): TResult;

  max<TResult>(expression: ReturnExpression<TResult, T>): TResult;

  count(expression?: LambdaExpression<T>): number;

  toList(): Array<T>;
}