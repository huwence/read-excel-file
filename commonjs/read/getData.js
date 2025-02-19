"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getData;
var _dropEmptyRows = _interopRequireDefault(require("./dropEmptyRows.js"));
var _dropEmptyColumns = _interopRequireDefault(require("./dropEmptyColumns.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function getData(sheet, options) {
  var dimensions = sheet.dimensions,
    cells = sheet.cells;

  // If the sheet is empty.
  if (cells.length === 0) {
    return [];
  }
  var _dimensions = _slicedToArray(dimensions, 2),
    leftTop = _dimensions[0],
    rightBottom = _dimensions[1];

  // Don't discard empty rows or columns at the start.
  // https://github.com/catamphetamine/read-excel-file/issues/102
  // const colsCount = (rightBottom.column - leftTop.column) + 1
  // const rowsCount = (rightBottom.row - leftTop.row) + 1

  var colsCount = rightBottom.column;
  var rowsCount = rightBottom.row;

  // Initialize spreadsheet data structure.
  var data = new Array(rowsCount);
  var i = 0;
  while (i < rowsCount) {
    data[i] = new Array(colsCount);
    var j = 0;
    while (j < colsCount) {
      data[i][j] = null;
      j++;
    }
    i++;
  }

  // Fill in spreadsheet `data`.
  // (this code implies that `cells` aren't necessarily sorted by row and column:
  //  maybe that's not correct, this piece code was initially copy-pasted
  //  from some other library that used `XPath`)
  for (var _iterator = _createForOfIteratorHelperLoose(cells), _step; !(_step = _iterator()).done;) {
    var cell = _step.value;
    // Don't discard empty rows or columns at the start.
    // https://github.com/catamphetamine/read-excel-file/issues/102
    // const rowIndex = cell.row - leftTop.row
    // const columnIndex = cell.column - leftTop.column
    var rowIndex = cell.row - 1;
    var columnIndex = cell.column - 1;
    // Ignore the data in the cell if it's outside of the spreadsheet's "dimensions".
    if (columnIndex < colsCount && rowIndex < rowsCount) {
      data[rowIndex][columnIndex] = cell.value;
    }
  }

  // Fill in the row map.
  var rowMap = options.rowMap;
  if (rowMap) {
    var _i2 = 0;
    while (_i2 < data.length) {
      rowMap[_i2] = _i2;
      _i2++;
    }
  }

  // Drop empty columns or rows.
  data = (0, _dropEmptyRows["default"])((0, _dropEmptyColumns["default"])(data, {
    onlyTrimAtTheEnd: true
  }), {
    onlyTrimAtTheEnd: true,
    rowMap: rowMap
  });

  // Optionally transform data before applying `schema`.
  if (options.transformData) {
    data = options.transformData(data);
    // data = options.transformData(data, {
    //   dropEmptyRowsAndColumns(data) {
    //     return dropEmptyRows(dropEmptyColumns(data), { rowMap })
    //   }
    // })
  }

  return data;
}
//# sourceMappingURL=getData.js.map