"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseSheet;
var _parseCells = _interopRequireDefault(require("./parseCells.js"));
var _parseDimensions = _interopRequireDefault(require("./parseDimensions.js"));
var _coordinates = require("./coordinates.js");
var _xlsx = require("../xml/xlsx.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function parseSheet(content, xml, values, styles, properties, options) {
  var sheet = xml.createDocument(content);
  var cells = (0, _parseCells["default"])(sheet, xml, values, styles, properties, options);
  var mergedCells = [];
  // const mergedCells = getMergedCells(sheet)
  for (var _iterator = _createForOfIteratorHelperLoose((0, _xlsx.getMergedCells)(sheet)), _step; !(_step = _iterator()).done;) {
    var mergedCell = _step.value;
    var _mergedCell$split$map = mergedCell.split(':').map(_coordinates.parseCellCoordinates),
      _mergedCell$split$map2 = _slicedToArray(_mergedCell$split$map, 2),
      from = _mergedCell$split$map2[0],
      to = _mergedCell$split$map2[1];
    // console.log('Merged Cell.', 'From:', from, 'To:', to)
    mergedCells.push({
      from: from,
      to: to
    });
  }

  // `dimensions` defines the spreadsheet area containing all non-empty cells.
  // https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.sheetdimension?view=openxml-2.8.1
  var dimensions = (0, _parseDimensions["default"])(sheet) || (0, _coordinates.calculateDimensions)(cells);
  return {
    cells: cells,
    dimensions: dimensions,
    mergedCells: mergedCells
  };
}
//# sourceMappingURL=parseSheet.js.map