export class QueryParser {
  constructor(private breakpoints) {}

  public parseQuery(input: string): string {
    const resultQueries = [];
    const queries = input.split(',');

    for (let query of queries) {
      query = query.trim();
      const orEq = query[1] === '=';
      const breakPoint = this.breakpoints[query.replace(/^(<|>)?=?/, '')];

      if (!breakPoint) {
        resultQueries.push(query);
        continue;
      }

      // Expressions should be used first
      if (typeof breakPoint === 'string') {
        resultQueries.unshift(breakPoint);
        continue;
      }

      const {value, param, precision} = breakPoint;

      let numValue = value;
      let units = '';
      const precisionVal = orEq ? 0 : precision || 1;

      if (typeof value === 'string') {
        const match = breakPoint.value.match(/[a-zA-Z]+/);
        const index = match && match.index;
        numValue = parseFloat(value.slice(0, index));
        units = value.slice(index);
      }

      switch (query[0]) {
        case '<':
          query = `(max-${breakPoint.param}: ${numValue - precisionVal}${units})`;
          break;
        case '>':
          query = `(min-${breakPoint.param}: ${numValue + precisionVal}${units})`;
          break;
        default:
          query = `(${breakPoint.param}: ${value})`;
          break;
      }

      if (breakPoint.suffix) {
        query = `${query} and ${breakPoint.suffix}`;
      }
      resultQueries.push(query);
    }

    return resultQueries.join(' and ');
  }
}
