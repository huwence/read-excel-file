"use strict";

var _path = _interopRequireDefault(require("path"));
var _readSheetNamesNode = _interopRequireDefault(require("./readSheetNamesNode.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
describe('readSheetNamesNode', function () {
  it('should read the list of sheet names in an *.xlsx file in Node.js', function () {
    return (0, _readSheetNamesNode["default"])(_path["default"].resolve('./test/spreadsheets/multiple-sheets.xlsx')).then(function (sheetNames) {
      sheetNames.should.deep.equal(['sheet 1', 'sheet 2']);
    });
  });
});
//# sourceMappingURL=readSheetNamesNode.test.js.map