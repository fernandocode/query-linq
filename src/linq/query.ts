import { DoubleExpression, Expression, Group, LambdaExpression, Order, ReturnExpression, ValueExpression, WhereExpression } from "./types";
import { Queryable } from "./queryable";

export class Query<T> implements Queryable<T> {

  constructor(
    private _list: T[]
  ) {
  }

  public where(expression: WhereExpression<T>): Query<T> {
    if (expression) {
      const resultList: any[] = [];
      this.toList().forEach((item, index) => {
        const match = expression(item, index);
        if (match) {
          resultList.push(item);
        }
      });
      return new Query(resultList);
    }
    return new Query(this.toList());
  }

  public select<TKey>(expression: ReturnExpression<TKey, T>): Query<TKey> {
    const resultList = this.toList().map(expression);
    return new Query(resultList);
  }

  public asc(expression: ValueExpression<T>): Query<T> {
    return this.order(expression, Order.ASC);
  }

  public desc(expression: ValueExpression<T>): Query<T> {
    return this.order(expression, Order.DESC);
  }

  public order(expression: ValueExpression<T>, order: Order): Query<T> {
    const resultList = this.toList()
      .slice() // prevent sort original array instance
      .sort((a: T, b: T) => {
        const valueA = expression(a);
        const valueB = expression(b);
        if (valueA < valueB) {
          return order === Order.DESC ? 1 : -1;
        }
        if (valueA > valueB) {
          return order === Order.ASC ? 1 : -1;
        }
        return 0;
      });
    return new Query(resultList);
  }

  public groupBy<TKey>(expression: ReturnExpression<TKey, T>): Query<Group<TKey, T>> {
    const g = this.toList().reduce((obj: any, item) => {
      const keyValue = expression(item);
      const key = keyValue + "";
      obj[key] = obj[key] || [];
      obj[key].push(item);
      obj[key].__key = keyValue;
      return obj;
    }, {});
    const result = Object.keys(g).map((key) => {
      return { key: g[key].__key, group: g[key] };
    });
    return new Query(result);
  }

  public min<TResult>(expression: ReturnExpression<TResult, T>): TResult {
    return this.asc(expression).select(expression).firstOrDefault();
  }

  public max<TResult>(expression: ReturnExpression<TResult, T>): TResult {
    return this.desc(expression).select(expression).firstOrDefault();
  }

  public aggregate(expression: DoubleExpression<any, T, T>): any {
    return this.toList().reduce((previous, current) => {
      return expression(previous, current);
    });
  }

  public count(expression?: LambdaExpression<T>): number {
    return this.toList(expression).length;
  }

  public limit(limit: number, offset: number = 0): Query<T> {
    return new Query(this.toList().slice(offset, limit + offset));
  }

  public firstOrDefault(expression?: LambdaExpression<T>, _default?: T): T {
    const list = this.toList(expression);
    return list && list.length ? list[0] : _default;
  }

  public toList(expression?: LambdaExpression<T>): T[] {
    if (expression) {
      return this.where(expression)._list;
    }
    return this._list;
  }
}
