import { findChild, findChildren, forEach, map, getTagName } from './dom.js';
export function getCells(document) {
  var worksheet = document.documentElement;
  var sheetData = findChild(worksheet, 'sheetData');
  var cells = [];
  forEach(sheetData, 'row', function (row) {
    forEach(row, 'c', function (cell) {
      cells.push(cell);
    });
  });
  return cells;
}
export function getMergedCells(document) {
  var worksheet = document.documentElement;
  var mergedCells = findChild(worksheet, 'mergeCells');
  var mergedCellsInfo = [];
  if (mergedCells) {
    forEach(mergedCells, 'mergeCell', function (mergedCell) {
      mergedCellsInfo.push(mergedCell.getAttribute('ref'));
    });
  }
  return mergedCellsInfo;
}
export function getCellValue(document, node) {
  return findChild(node, 'v');
}
export function getCellInlineStringValue(document, node) {
  if (node.firstChild && getTagName(node.firstChild) === 'is' && node.firstChild.firstChild && getTagName(node.firstChild.firstChild) === 't') {
    return node.firstChild.firstChild.textContent;
  }
}
export function getDimensions(document) {
  var worksheet = document.documentElement;
  var dimensions = findChild(worksheet, 'dimension');
  if (dimensions) {
    return dimensions.getAttribute('ref');
  }
}
export function getBaseStyles(document) {
  var styleSheet = document.documentElement;
  var cellStyleXfs = findChild(styleSheet, 'cellStyleXfs');
  if (cellStyleXfs) {
    return findChildren(cellStyleXfs, 'xf');
  }
  return [];
}
export function getCellStyles(document) {
  var styleSheet = document.documentElement;
  var cellXfs = findChild(styleSheet, 'cellXfs');
  if (!cellXfs) {
    return [];
  }
  return findChildren(cellXfs, 'xf');
}
export function getNumberFormats(document) {
  var styleSheet = document.documentElement;
  var numberFormats = [];
  var numFmts = findChild(styleSheet, 'numFmts');
  if (numFmts) {
    return findChildren(numFmts, 'numFmt');
  }
  return [];
}
export function getSharedStrings(document) {
  // An `<si/>` element can contain a `<t/>` (simplest case) or a set of `<r/>` ("rich formatting") elements having `<t/>`.
  // https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.sharedstringitem?redirectedfrom=MSDN&view=openxml-2.8.1
  // http://www.datypic.com/sc/ooxml/e-ssml_si-1.html

  var sst = document.documentElement;
  return map(sst, 'si', function (string) {
    var t = findChild(string, 't');
    if (t) {
      return t.textContent;
    }
    var value = '';
    forEach(string, 'r', function (r) {
      value += findChild(r, 't').textContent;
    });
    return value;
  });
}
export function getWorkbookProperties(document) {
  var workbook = document.documentElement;
  return findChild(workbook, 'workbookPr');
}
export function getRelationships(document) {
  var relationships = document.documentElement;
  return findChildren(relationships, 'Relationship');
}
export function getSheets(document) {
  var workbook = document.documentElement;
  var sheets = findChild(workbook, 'sheets');
  return findChildren(sheets, 'sheet');
}
//# sourceMappingURL=xlsx.js.map