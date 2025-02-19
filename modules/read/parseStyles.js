function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import { getBaseStyles, getCellStyles, getNumberFormats } from '../xml/xlsx.js';

// http://officeopenxml.com/SSstyles.php
// Returns an array of cell styles.
// A cell style index is its ID.
export default function parseStyles(content, xml) {
  if (!content) {
    return {};
  }

  // https://social.msdn.microsoft.com/Forums/sqlserver/en-US/708978af-b598-45c4-a598-d3518a5a09f0/howwhen-is-cellstylexfs-vs-cellxfs-applied-to-a-cell?forum=os_binaryfile
  // https://www.office-forums.com/threads/cellxfs-cellstylexfs.2163519/
  var doc = xml.createDocument(content);
  var baseStyles = getBaseStyles(doc).map(parseCellStyle);
  var numberFormats = getNumberFormats(doc).map(parseNumberFormatStyle).reduce(function (formats, format) {
    // Format ID is a numeric index.
    // There're some standard "built-in" formats (in Excel) up to about `100`.
    formats[format.id] = format;
    return formats;
  }, []);
  var getCellStyle = function getCellStyle(xf) {
    if (xf.hasAttribute('xfId')) {
      return _objectSpread(_objectSpread({}, baseStyles[xf.xfId]), parseCellStyle(xf, numberFormats));
    }
    return parseCellStyle(xf, numberFormats);
  };
  return getCellStyles(doc).map(getCellStyle);
}
function parseNumberFormatStyle(numFmt) {
  return {
    id: numFmt.getAttribute('numFmtId'),
    template: numFmt.getAttribute('formatCode')
  };
}

// http://www.datypic.com/sc/ooxml/e-ssml_xf-2.html
function parseCellStyle(xf, numFmts) {
  var style = {};
  if (xf.hasAttribute('numFmtId')) {
    var numberFormatId = xf.getAttribute('numFmtId');
    // Built-in number formats don't have a `<numFmt/>` element in `styles.xml`.
    // https://hexdocs.pm/xlsxir/number_styles.html
    if (numFmts[numberFormatId]) {
      style.numberFormat = numFmts[numberFormatId];
    } else {
      style.numberFormat = {
        id: numberFormatId
      };
    }
  }
  return style;
}
//# sourceMappingURL=parseStyles.js.map