export class QueryParser {
  constructor(private breakpoints) {}

  public parseQuery(input: string) {
    const queries = input.split(',');

    return queries.map(query => this.parseSingleQuery(query)).join(',');
  }

  public parseSingleQuery(input: string): string {
    const resultQueries = [];
    const queries = input.split(' and ');

    let possibleMedia = '';
    for (let query of queries) {
      query = query.trim();
      const canBeEqual = query[1] === '=';
      const withoutComparison = query.replace(/^(<|>)?=?/, '');
      let breakpoint = this.breakpoints[withoutComparison];

      // If no breakpoint was found, treat as exact media query unless it can be interpreted as a number, e.g. '<980px'
      if (parseFloat(withoutComparison)) {
        breakpoint = {
          param: 'width',
          value: withoutComparison
        };
      } else if (!breakpoint) {
        resultQueries.push(query);
        continue;
      }

      if (typeof breakpoint === 'string') {
        resultQueries.push(breakpoint);
        continue;
      }

      const media = breakpoint.media;

      if (!possibleMedia && media) {
        possibleMedia = media;
      }

      if (media && media !== possibleMedia) {
        throw new Error(`Clash of media property used for different breakpoints in ${breakpoint}`);
      }

      const {value, param } = breakpoint;
      let numValue = value;
      let units = '';

      let precisionVal;
      if (typeof value === 'string') {
        const match = breakpoint.value.match(/[a-zA-Z]+/);
        const unitIndex = (match && match.index) || value.length;
        const number = value.slice(0, unitIndex);
        numValue = parseFloat(number);
        units = value.slice(unitIndex);

        if (number.includes('.')) {
          precisionVal = 1 / (10 ** (unitIndex - number.indexOf('.') - 1));
        }
      }

      if (canBeEqual) {
        precisionVal = 0;
      } else if (breakpoint.precision) {
        precisionVal = breakpoint.precision;
      } else if (units === 'px') {
        precisionVal = 1;
      } else if (!precisionVal) {
        precisionVal = 0.1;
      }

      // Can also use no value, e.g. { media: 'screen' }
      if (value) {
        switch (query[0]) {
          case '<':
            query = `(max-${breakpoint.param}: ${numValue - precisionVal}${units})`;
            break;
          case '>':
            query = `(min-${breakpoint.param}: ${numValue + precisionVal}${units})`;
            break;
          default:
            query = `(${breakpoint.param}: ${value})`;
            break;
        }
      } else {
        query = '';
      }

      const suffix = breakpoint.suffix;
      if (suffix) {
        query = query ? `${query} and ${suffix}` : suffix;
      }

      if (query) {
        resultQueries.push(query);
      }
    }

    const prefix = possibleMedia ? possibleMedia + ' and ' : '';
    return prefix + resultQueries.join(' and ');
  }
}
