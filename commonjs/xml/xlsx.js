"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseStyles = getBaseStyles;
exports.getCellInlineStringValue = getCellInlineStringValue;
exports.getCellStyles = getCellStyles;
exports.getCellValue = getCellValue;
exports.getCells = getCells;
exports.getDimensions = getDimensions;
exports.getMergedCells = getMergedCells;
exports.getNumberFormats = getNumberFormats;
exports.getRelationships = getRelationships;
exports.getSharedStrings = getSharedStrings;
exports.getSheets = getSheets;
exports.getWorkbookProperties = getWorkbookProperties;
var _dom = require("./dom.js");
function getCells(document) {
  var worksheet = document.documentElement;
  var sheetData = (0, _dom.findChild)(worksheet, 'sheetData');
  var cells = [];
  (0, _dom.forEach)(sheetData, 'row', function (row) {
    (0, _dom.forEach)(row, 'c', function (cell) {
      cells.push(cell);
    });
  });
  return cells;
}
function getMergedCells(document) {
  var worksheet = document.documentElement;
  var mergedCells = (0, _dom.findChild)(worksheet, 'mergeCells');
  var mergedCellsInfo = [];
  if (mergedCells) {
    (0, _dom.forEach)(mergedCells, 'mergeCell', function (mergedCell) {
      mergedCellsInfo.push(mergedCell.getAttribute('ref'));
    });
  }
  return mergedCellsInfo;
}
function getCellValue(document, node) {
  return (0, _dom.findChild)(node, 'v');
}
function getCellInlineStringValue(document, node) {
  if (node.firstChild && (0, _dom.getTagName)(node.firstChild) === 'is' && node.firstChild.firstChild && (0, _dom.getTagName)(node.firstChild.firstChild) === 't') {
    return node.firstChild.firstChild.textContent;
  }
}
function getDimensions(document) {
  var worksheet = document.documentElement;
  var dimensions = (0, _dom.findChild)(worksheet, 'dimension');
  if (dimensions) {
    return dimensions.getAttribute('ref');
  }
}
function getBaseStyles(document) {
  var styleSheet = document.documentElement;
  var cellStyleXfs = (0, _dom.findChild)(styleSheet, 'cellStyleXfs');
  if (cellStyleXfs) {
    return (0, _dom.findChildren)(cellStyleXfs, 'xf');
  }
  return [];
}
function getCellStyles(document) {
  var styleSheet = document.documentElement;
  var cellXfs = (0, _dom.findChild)(styleSheet, 'cellXfs');
  if (!cellXfs) {
    return [];
  }
  return (0, _dom.findChildren)(cellXfs, 'xf');
}
function getNumberFormats(document) {
  var styleSheet = document.documentElement;
  var numberFormats = [];
  var numFmts = (0, _dom.findChild)(styleSheet, 'numFmts');
  if (numFmts) {
    return (0, _dom.findChildren)(numFmts, 'numFmt');
  }
  return [];
}
function getSharedStrings(document) {
  // An `<si/>` element can contain a `<t/>` (simplest case) or a set of `<r/>` ("rich formatting") elements having `<t/>`.
  // https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.sharedstringitem?redirectedfrom=MSDN&view=openxml-2.8.1
  // http://www.datypic.com/sc/ooxml/e-ssml_si-1.html

  var sst = document.documentElement;
  return (0, _dom.map)(sst, 'si', function (string) {
    var t = (0, _dom.findChild)(string, 't');
    if (t) {
      return t.textContent;
    }
    var value = '';
    (0, _dom.forEach)(string, 'r', function (r) {
      value += (0, _dom.findChild)(r, 't').textContent;
    });
    return value;
  });
}
function getWorkbookProperties(document) {
  var workbook = document.documentElement;
  return (0, _dom.findChild)(workbook, 'workbookPr');
}
function getRelationships(document) {
  var relationships = document.documentElement;
  return (0, _dom.findChildren)(relationships, 'Relationship');
}
function getSheets(document) {
  var workbook = document.documentElement;
  var sheets = (0, _dom.findChild)(workbook, 'sheets');
  return (0, _dom.findChildren)(sheets, 'sheet');
}
//# sourceMappingURL=xlsx.js.map