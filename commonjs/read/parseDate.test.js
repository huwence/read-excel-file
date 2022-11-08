"use strict";

var _parseDate = _interopRequireDefault(require("./parseDate.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
describe('parseDate', function () {
  it('should parse Excel "serial" dates', function () {
    var date = convertToUTCTimezone(new Date(2018, 3 - 1, 24));
    // Excel stores dates as integers.
    // E.g. '24/03/2018' === 43183
    (0, _parseDate["default"])(43183).getTime().should.equal(date.getTime());
  });
});

// Converts timezone to UTC while preserving the same time
function convertToUTCTimezone(date) {
  // Doesn't account for leap seconds but I guess that's ok
  // given that javascript's own `Date()` does not either.
  // https://www.timeanddate.com/time/leap-seconds-background.html
  //
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  //
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}
//# sourceMappingURL=parseDate.test.js.map