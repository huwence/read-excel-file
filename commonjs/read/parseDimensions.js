"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseDimensions;
var _coordinates = require("./coordinates.js");
var _xlsx = require("../xml/xlsx.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// `dimensions` defines the spreadsheet area containing all non-empty cells.
// https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.sheetdimension?view=openxml-2.8.1
function parseDimensions(sheet) {
  var dimensions = (0, _xlsx.getDimensions)(sheet);
  if (dimensions) {
    dimensions = dimensions.split(':').map(_coordinates.parseCellCoordinates).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        row = _ref2[0],
        column = _ref2[1];
      return {
        row: row,
        column: column
      };
    });
    // Sometimes there can be just a single cell as a spreadsheet's "dimensions".
    // For example, the default "dimensions" in Apache POI library is "A1",
    // meaning that only the first cell in the spreadsheet is used.
    //
    // A quote from Apache POI library:
    // "Single cell ranges are formatted like single cell references (e.g. 'A1' instead of 'A1:A1')."
    //
    if (dimensions.length === 1) {
      dimensions = [dimensions[0], dimensions[0]];
    }
    return dimensions;
  }
}
//# sourceMappingURL=parseDimensions.js.map