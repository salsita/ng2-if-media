export class QueryParser {
  constructor(private breakpoints) {}

  public parseQuery(input: string): string {
    const resultQueries = [];
    const queries = input.split(',');

    let possibleMedia = '';
    for (let query of queries) {
      query = query.trim();
      const orEq = query[1] === '=';
      const breakpointName = query.replace(/^(<|>)?=?/, '');
      const breakpoint = this.breakpoints[breakpointName];

      if (!breakpoint) {
        resultQueries.push(query);
        continue;
      }

      // FIXME: Add '<980px' possibility -> if 980px isn't a breakpoint and it's possible to be parseInt-ed just decrease it by 1 and go with max/min width
      // FIXME: Add or logic (isMedia(x) || isMedia(y))
      if (typeof breakpoint === 'string') {
        resultQueries.push(breakpoint);
        continue;
      }

      const {value, param, precision, media, suffix} = breakpoint;

      if (!possibleMedia && media) {
        possibleMedia = media;
      }

      if (media && media !== possibleMedia) {
        throw new Error(`Clash of media property used for different breakpoints in ${breakpoint}`);
      }

      let numValue = value;
      let units = '';
      const precisionVal = orEq ? 0 : precision || 1;

      if (typeof value === 'string') {
        const match = breakpoint.value.match(/[a-zA-Z]+/);
        const index = match && match.index;
        numValue = parseFloat(value.slice(0, index));
        units = value.slice(index);
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
