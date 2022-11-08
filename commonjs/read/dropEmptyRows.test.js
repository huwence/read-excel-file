"use strict";

var _dropEmptyRows = _interopRequireDefault(require("./dropEmptyRows.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
describe('dropEmptyRows', function () {
  it('should drop empty rows (only at the end)', function () {
    (0, _dropEmptyRows["default"])([[null, null, null], ['A', 'B', 'C'], [null, 'D', null], [null, null, null], ['E', 'F', 'G'], [null, null, null]], {
      onlyTrimAtTheEnd: true
    }).should.deep.equal([[null, null, null], ['A', 'B', 'C'], [null, 'D', null], [null, null, null], ['E', 'F', 'G']]);
  });
  it('should drop empty rows', function () {
    (0, _dropEmptyRows["default"])([[null, null, null], ['A', 'B', 'C'], [null, 'D', null], [null, null, null], ['E', 'F', 'G'], [null, null, null]]).should.deep.equal([['A', 'B', 'C'], [null, 'D', null], ['E', 'F', 'G']]);
  });
  it('should generate row map when dropping empty rows', function () {
    var rowMap = [0, 1, 2, 3, 4];
    (0, _dropEmptyRows["default"])([[null, null, null], ['A', 'B', 'C'], [null, 'D', null], [null, null, null], ['E', 'F', 'G']], {
      rowMap: rowMap
    }).should.deep.equal([['A', 'B', 'C'], [null, 'D', null], ['E', 'F', 'G']]);
    rowMap.should.deep.equal([1, 2, 4]);
  });
});
//# sourceMappingURL=dropEmptyRows.test.js.map