// Constants for time units in milliseconds
const s = 1000; // seconds
const m = s * 60; // minutes
const h = m * 60; // hours
const d = h * 24; // days
const w = d * 7; // weeks
const y = d * 365.25; // years

/**
 * Convert a time string into milliseconds.
 *
 * The function accepts a string that represents a time duration and converts it
 * into milliseconds.
 *
 * If no unit is specified, the function defaults to milliseconds. The supported
 * units are:
 * - 's' for seconds
 * - 'm' for minutes
 * - 'h' for hours
 * - 'd' for days
 * - 'w' for weeks
 * - 'y' for years
 *
 * If a value is provided without a unit, it is treated as milliseconds.
 *
 * The function also handles negative values. For example, '-3d' will be
 * converted to negative milliseconds.
 *
 * @param str - The time string to convert (e.g., '2d', '3h', '1w', '200',
 * '-3d').
 * @returns The equivalent time in milliseconds.
 * @throws Error if the input format is invalid or an unknown unit is specified.
 *
 * @example
 * console.log(ms('2d'));    // 172800000 (2 days)
 * console.log(ms('1d'));    // 86400000 (1 day)
 * console.log(ms('10h'));   // 36000000 (10 hours)
 * console.log(ms('2.5h'));  // 9000000 (2.5 hours)
 * console.log(ms('2h'));    // 7200000 (2 hours)
 * console.log(ms('1m'));    // 60000 (1 minute)
 * console.log(ms('5s'));    // 5000 (5 seconds)
 * console.log(ms('1y'));    // 31557600000 (1 year)
 * console.log(ms('100'));   // 100 (defaulting to milliseconds)
 * console.log(ms('-3d'));  // -259200000 (-3 days)
 * console.log(ms('-1h'));  // -3600000 (-1 hour)
 * console.log(ms('-200')); // -200 (defaulting to milliseconds)
 */
function ms(str: string): number {
  // Regular expression to match the input format, with an optional unit
  const match = /^(-?\d*\.?\d+)\s*(s|m|h|d|w|y)?$/i.exec(str.trim());
  if (!match) {
    throw new Error('Invalid time format');
  }

  // Extract the value and unit from the match
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'ms').toLowerCase(); // Default to 'ms' if no unit
                                                 // is specified

  // Convert to milliseconds based on the unit
  switch (unit) {
    case 'y':
      return value * y;
    case 'w':
      return value * w;
    case 'd':
      return value * d;
    case 'h':
      return value * h;
    case 'm':
      return value * m;
    case 's':
      return value * s;
    case 'ms': // Handle milliseconds as a special case
      return value;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
}

export default ms;
