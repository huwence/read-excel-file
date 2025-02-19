"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isDateTimestamp;
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
// XLSX does have "d" type for dates, but it's not commonly used.
// Instead, it prefers using "n" type for storing dates as timestamps.
//
// Whether a numeric value is a number or a date timestamp, it sometimes could be
// detected by looking at the value "format" and seeing if it's a date-specific one.
// https://github.com/catamphetamine/read-excel-file/issues/3#issuecomment-395770777
//
// The list of generic numeric value "formats":
// https://xlsxwriter.readthedocs.io/format.html#format-set-num-format
//
function isDateTimestamp(value, styleId, styles, options) {
  if (styleId) {
    var style = styles[styleId];
    if (!style) {
      throw new Error("Cell style not found: ".concat(styleId));
    }
    if (
    // Whether it's a "number format" that's conventionally used for storing date timestamps.
    BUILT_IN_DATE_NUMBER_FORMAT_IDS.indexOf(parseInt(style.numberFormat.id)) >= 0 ||
    // Whether it's a "number format" that uses a "formatting template"
    // that the developer is certain is a date formatting template.
    options.dateFormat && style.numberFormat.template === options.dateFormat ||
    // Whether the "smart formatting template" feature is not disabled
    // and it has detected that it's a date formatting template by looking at it.
    options.smartDateParser !== false && style.numberFormat.template && isDateTemplate(style.numberFormat.template)) {
      return true;
    }
  }
}

// https://hexdocs.pm/xlsxir/number_styles.html
var BUILT_IN_DATE_NUMBER_FORMAT_IDS = [14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 30, 36, 45, 46, 47, 50, 57];

// On some date formats, there's an "[$-414]" prefix.
// I don't have any idea what that is.
//
// https://stackoverflow.com/questions/4730152/what-indicates-an-office-open-xml-cell-contains-a-date-time-value
//
// Examples:
//
// * 27 (built-in format) "[$-404]e/m/d"
// * 164 (custom format) "[$-414]mmmm\ yyyy;@"
//
var DATE_FORMAT_WEIRD_PREFIX = /^\[\$-414\]/;

// On some date formats, there's an ";@" postfix.
// I don't have any idea what that is.
// Examples:
//
// * 164 (custom format) "m/d/yyyy;@"
// * 164 (custom format) "[$-414]mmmm\ yyyy;@"
//
var DATE_FORMAT_WEIRD_POSTFIX = /;@$/;
function isDateTemplate(template) {
  // Date format tokens could be in upper case or in lower case.
  // There seems to be no single standard.
  // So lowercase the template first.
  template = template.toLowerCase();

  // On some date formats, there's an "[$-414]" prefix.
  // I don't have any idea what that is. Trim it.
  template = template.replace(DATE_FORMAT_WEIRD_PREFIX, '');

  // On some date formats, there's an ";@" postfix.
  // I don't have any idea what that is. Trim it.
  template = template.replace(DATE_FORMAT_WEIRD_POSTFIX, '');
  var tokens = template.split(/\W+/);
  for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done;) {
    var token = _step.value;
    if (DATE_TEMPLATE_TOKENS.indexOf(token) < 0) {
      return false;
    }
  }
  return true;
}

// These tokens could be in upper case or in lower case.
// There seems to be no single standard, so using lower case.
var DATE_TEMPLATE_TOKENS = [
// Seconds (min two digits). Example: "05".
'ss',
// Minutes (min two digits). Example: "05". Could also be "Months". Weird.
'mm',
// Hours. Example: "1".
'h',
// Hours (min two digits). Example: "01".
'hh',
// "AM" part of "AM/PM". Lowercased just in case.
'am',
// "PM" part of "AM/PM". Lowercased just in case.
'pm',
// Day. Example: "1"
'd',
// Day (min two digits). Example: "01"
'dd',
// Month (numeric). Example: "1".
'm',
// Month (numeric, min two digits). Example: "01". Could also be "Minutes". Weird.
'mm',
// Month (shortened month name). Example: "Jan".
'mmm',
// Month (full month name). Example: "January".
'mmmm',
// Two-digit year. Example: "20".
'yy',
// Full year. Example: "2020".
'yyyy',
// I don't have any idea what "e" means.
// It's used in "built-in" XLSX formats:
// * 27 '[$-404]e/m/d';
// * 36 '[$-404]e/m/d';
// * 50 '[$-404]e/m/d';
// * 57 '[$-404]e/m/d';
'e'];
//# sourceMappingURL=isDateTimestamp.js.map