"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseFilePaths;
var _xlsx = require("../xml/xlsx.js");
/**
 * Returns sheet file paths.
 * Seems that the correct place to look for the `sheetId` -> `filename` mapping
 * is `xl/_rels/workbook.xml.rels` file.
 * https://github.com/tidyverse/readxl/issues/104
 * @param  {string} content — `xl/_rels/workbook.xml.rels` file contents.
 * @param  {object} xml
 * @return {object}
 */
function parseFilePaths(content, xml) {
  // Example:
  // <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  //   ...
  //   <Relationship
  //     Id="rId3"
  //     Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"
  //     Target="worksheets/sheet1.xml"/>
  // </Relationships>
  var document = xml.createDocument(content);
  var filePaths = {
    sheets: {},
    sharedStrings: undefined,
    styles: undefined
  };
  var addFilePathInfo = function addFilePathInfo(relationship) {
    var filePath = relationship.getAttribute('Target');
    var fileType = relationship.getAttribute('Type');
    switch (fileType) {
      case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles':
        filePaths.styles = getFilePath(filePath);
        break;
      case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings':
        filePaths.sharedStrings = getFilePath(filePath);
        break;
      case 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet':
        filePaths.sheets[relationship.getAttribute('Id')] = getFilePath(filePath);
        break;
    }
  };
  (0, _xlsx.getRelationships)(document).forEach(addFilePathInfo);

  // Seems like "sharedStrings.xml" is not required to exist.
  // For example, when the spreadsheet doesn't contain any strings.
  // https://github.com/catamphetamine/read-excel-file/issues/85
  // if (!filePaths.sharedStrings) {
  //   throw new Error('"sharedStrings.xml" file not found in the *.xlsx file')
  // }

  return filePaths;
}
function getFilePath(path) {
  // Normally, `path` is a relative path inside the ZIP archive,
  // like "worksheets/sheet1.xml", or "sharedStrings.xml", or "styles.xml".
  // There has been one weird case when file path was an absolute path,
  // like "/xl/worksheets/sheet1.xml" (specifically for sheets):
  // https://github.com/catamphetamine/read-excel-file/pull/95
  // Other libraries (like `xlsx`) and software (like Google Docs)
  // seem to support such absolute file paths, so this library does too.
  if (path[0] === '/') {
    return path.slice('/'.length);
  }
  // // Seems like a path could also be a URL.
  // // http://officeopenxml.com/anatomyofOOXML-xlsx.php
  // if (/^[a-z]+\:\/\//.test(path)) {
  //   return path
  // }
  return 'xl/' + path;
}
//# sourceMappingURL=parseFilePaths.js.map