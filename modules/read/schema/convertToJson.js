function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import parseDate from '../parseDate.js';
import Integer, { isInteger } from '../../types/Integer.js';
import URL, { isURL } from '../../types/URL.js';
import Email, { isEmail } from '../../types/Email.js';
var DEFAULT_OPTIONS = {
  isColumnOriented: false
};

/**
 * Convert 2D array to nested objects.
 * If row oriented data, row 0 is dotted key names.
 * Column oriented data is transposed.
 * @param {any[][]} data - An array of rows, each row being an array of cells.
 * @param {object} schema
 * @return {object[]}
 */
export default function (data, schema, options) {
  if (options) {
    options = _objectSpread(_objectSpread({}, DEFAULT_OPTIONS), options);
  } else {
    options = DEFAULT_OPTIONS;
  }
  var _options = options,
    isColumnOriented = _options.isColumnOriented,
    rowMap = _options.rowMap,
    ignoreEmptyRows = _options.ignoreEmptyRows;
  validateSchema(schema);
  if (isColumnOriented) {
    data = transpose(data);
  }
  var columns = data[0];
  var results = [];
  var errors = [];
  for (var i = 1; i < data.length; i++) {
    var result = read(schema, data[i], i, columns, errors, options);
    if (result !== null || ignoreEmptyRows === false) {
      results.push(result);
    }
  }

  // Correct error rows.
  if (rowMap) {
    for (var _iterator = _createForOfIteratorHelperLoose(errors), _step; !(_step = _iterator()).done;) {
      var error = _step.value;
      // Convert the `row` index in `data` to the
      // actual `row` index in the spreadsheet.
      // `- 1` converts row number to row index.
      // `+ 1` converts row index to row number.
      error.row = rowMap[error.row - 1] + 1;
    }
  }
  return {
    rows: results,
    errors: errors
  };
}
function read(schema, row, rowIndex, columns, errors, options) {
  var object = {};
  var isEmptyObject = true;
  var _loop = function _loop() {
    var key = _Object$keys[_i];
    var schemaEntry = schema[key];
    var isNestedSchema = _typeof(schemaEntry.type) === 'object' && !Array.isArray(schemaEntry.type);
    var rawValue = row[columns.indexOf(key)];
    if (rawValue === undefined) {
      rawValue = null;
    }
    var value = void 0;
    var error = void 0;
    var reason = void 0;
    if (isNestedSchema) {
      value = read(schemaEntry.type, row, rowIndex, columns, errors, options);
    } else {
      if (rawValue === null) {
        value = null;
      } else if (Array.isArray(schemaEntry.type)) {
        var notEmpty = false;
        var array = parseArray(rawValue).map(function (_value) {
          var result = parseValue(_value, schemaEntry, options);
          if (result.error) {
            value = _value;
            error = result.error;
            reason = result.reason;
          }
          if (result.value !== null) {
            notEmpty = true;
          }
          return result.value;
        });
        if (!error) {
          value = notEmpty ? array : null;
        }
      } else {
        var result = parseValue(rawValue, schemaEntry, options);
        error = result.error;
        reason = result.reason;
        value = error ? rawValue : result.value;
      }
    }
    if (!error && value === null && schemaEntry.required) {
      error = 'required';
    }
    if (error) {
      error = {
        error: error,
        row: rowIndex + 1,
        column: key,
        value: value
      };
      if (reason) {
        error.reason = reason;
      }
      if (schemaEntry.type) {
        error.type = schemaEntry.type;
      }
      errors.push(error);
    } else {
      if (isEmptyObject && value !== null) {
        isEmptyObject = false;
      }
      if (value !== null || options.includeNullValues) {
        object[schemaEntry.prop] = value;
      }
    }
  };
  for (var _i = 0, _Object$keys = Object.keys(schema); _i < _Object$keys.length; _i++) {
    _loop();
  }
  if (isEmptyObject) {
    return null;
  }
  return object;
}

/**
 * Converts textual value to a javascript typed value.
 * @param  {any} value
 * @param  {object} schemaEntry
 * @return {{ value: any, error: string }}
 */
export function parseValue(value, schemaEntry, options) {
  if (value === null) {
    return {
      value: null
    };
  }
  var result;
  if (schemaEntry.parse) {
    result = parseCustomValue(value, schemaEntry.parse);
  } else if (schemaEntry.type) {
    result = parseValueOfType(value,
    // Supports parsing array types.
    // See `parseArray()` function for more details.
    // Example `type`: String[]
    // Input: 'Barack Obama, "String, with, colons", Donald Trump'
    // Output: ['Barack Obama', 'String, with, colons', 'Donald Trump']
    Array.isArray(schemaEntry.type) ? schemaEntry.type[0] : schemaEntry.type, options);
  } else {
    result = {
      value: value
    };
    // throw new Error('Invalid schema entry: no .type and no .parse():\n\n' + JSON.stringify(schemaEntry, null, 2))
  }
  // If errored then return the error.
  if (result.error) {
    return result;
  }
  if (result.value !== null) {
    if (schemaEntry.oneOf && schemaEntry.oneOf.indexOf(result.value) < 0) {
      return {
        error: 'invalid',
        reason: 'unknown'
      };
    }
    if (schemaEntry.validate) {
      try {
        schemaEntry.validate(result.value);
      } catch (error) {
        return {
          error: error.message
        };
      }
    }
  }
  return result;
}

/**
 * Converts textual value to a custom value using supplied `.parse()`.
 * @param  {any} value
 * @param  {function} parse
 * @return {{ value: any, error: string }}
 */
function parseCustomValue(value, parse) {
  try {
    value = parse(value);
    if (value === undefined) {
      return {
        value: null
      };
    }
    return {
      value: value
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}

/**
 * Converts textual value to a javascript typed value.
 * @param  {any} value
 * @param  {} type
 * @return {{ value: (string|number|Date|boolean), error: string, reason?: string }}
 */
function parseValueOfType(value, type, options) {
  switch (type) {
    case String:
      if (typeof value === 'string') {
        return {
          value: value
        };
      }
      // Excel tends to perform a forced automatic convertion of string-type values
      // to number-type ones when the user has input them. Otherwise, users wouldn't
      // be able to perform formula calculations on those cell values because users
      // won't bother manually choosing a "numeric" cell type for each cell, and
      // even if they did, choosing a "numeric" cell type every time wouldn't be an
      // acceptable "user experience".
      //
      // So, if a cell value is supposed to be a string and Excel has automatically
      // converted it to a number, perform a backwards conversion.
      //
      if (typeof value === 'number') {
        if (isNaN(value)) {
          return {
            error: 'invalid',
            reason: 'invalid_number'
          };
        }
        // The global `isFinite()` function filters out:
        // * NaN
        // * -Infinity
        // * Infinity
        //
        // All other values pass (including non-numbers).
        //
        if (!isFinite(value)) {
          return {
            error: 'invalid',
            reason: 'out_of_bounds'
          };
        }
        return {
          value: String(value)
        };
      }
      return {
        error: 'invalid',
        reason: 'not_a_string'
      };
    case Number:
    case Integer:
      // An XLSX file editing software might not always correctly
      // detect numeric values in string-type cells. Users won't bother
      // manually selecting a cell type, so the editing software has to guess
      // based on the user's input. One can assume that such auto-detection
      // might not always work.
      //
      // So, if a cell is supposed to be a numeric one, convert a string value to a number.
      //
      if (typeof value === 'string') {
        var stringifiedValue = value;
        value = Number(value);
        if (String(value) !== stringifiedValue) {
          return {
            error: 'invalid',
            reason: 'not_a_number'
          };
        }
      }
      if (typeof value !== 'number') {
        return {
          error: 'invalid',
          reason: 'not_a_number'
        };
      }
      if (isNaN(value)) {
        return {
          error: 'invalid',
          reason: 'invalid_number'
        };
      }
      // At this point, `value` can only be a number.
      //
      // The global `isFinite()` function filters out:
      // * NaN
      // * -Infinity
      // * Infinity
      //
      // All other values pass (including non-numbers).
      //
      if (!isFinite(value)) {
        return {
          error: 'invalid',
          reason: 'out_of_bounds'
        };
      }
      if (type === Integer && !isInteger(value)) {
        return {
          error: 'invalid',
          reason: 'not_an_integer'
        };
      }
      return {
        value: value
      };
    case URL:
      if (typeof value === 'string') {
        if (isURL(value)) {
          return {
            value: value
          };
        }
        return {
          error: 'invalid',
          reason: 'not_a_url'
        };
      }
      return {
        error: 'invalid',
        reason: 'not_a_string'
      };
    case Email:
      if (typeof value === 'string') {
        if (isEmail(value)) {
          return {
            value: value
          };
        }
        return {
          error: 'invalid',
          reason: 'not_an_email'
        };
      }
      return {
        error: 'invalid',
        reason: 'not_a_string'
      };
    case Date:
      // XLSX has no specific format for dates.
      // Sometimes a date can be heuristically detected.
      // https://github.com/catamphetamine/read-excel-file/issues/3#issuecomment-395770777
      if (value instanceof Date) {
        if (isNaN(value.valueOf())) {
          return {
            error: 'invalid',
            reason: 'out_of_bounds'
          };
        }
        return {
          value: value
        };
      }
      if (typeof value === 'number') {
        if (isNaN(value)) {
          return {
            error: 'invalid',
            reason: 'invalid_number'
          };
        }
        if (!isFinite(value)) {
          return {
            error: 'invalid',
            reason: 'out_of_bounds'
          };
        }
        var date = parseDate(value, options.properties);
        if (isNaN(date.valueOf())) {
          return {
            error: 'invalid',
            reason: 'out_of_bounds'
          };
        }
        return {
          value: date
        };
      }
      return {
        error: 'invalid',
        reason: 'not_a_date'
      };
    case Boolean:
      if (typeof value === 'boolean') {
        return {
          value: value
        };
      }
      return {
        error: 'invalid',
        reason: 'not_a_boolean'
      };
    default:
      if (typeof type === 'function') {
        return parseCustomValue(value, type);
      }
      throw new Error("Unknown schema type: ".concat(type && type.name || type));
  }
}
export function getBlock(string, endCharacter, startIndex) {
  var i = 0;
  var substring = '';
  var character;
  while (startIndex + i < string.length) {
    var _character = string[startIndex + i];
    if (_character === endCharacter) {
      return [substring, i];
    } else if (_character === '"') {
      var block = getBlock(string, '"', startIndex + i + 1);
      substring += block[0];
      i += '"'.length + block[1] + '"'.length;
    } else {
      substring += _character;
      i++;
    }
  }
  return [substring, i];
}

/**
 * Parses a string of comma-separated substrings into an array of substrings.
 * (the `export` is just for tests)
 * @param  {string} string — A string of comma-separated substrings.
 * @return {string[]} An array of substrings.
 */
export function parseArray(string) {
  var blocks = [];
  var index = 0;
  while (index < string.length) {
    var _getBlock = getBlock(string, ',', index),
      _getBlock2 = _slicedToArray(_getBlock, 2),
      substring = _getBlock2[0],
      length = _getBlock2[1];
    index += length + ','.length;
    blocks.push(substring.trim());
  }
  return blocks;
}

// Transpose a 2D array.
// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
var transpose = function transpose(array) {
  return array[0].map(function (_, i) {
    return array.map(function (row) {
      return row[i];
    });
  });
};
function validateSchema(schema) {
  for (var _i2 = 0, _Object$keys2 = Object.keys(schema); _i2 < _Object$keys2.length; _i2++) {
    var key = _Object$keys2[_i2];
    var entry = schema[key];
    if (!entry.prop) {
      throw new Error("\"prop\" not defined for schema entry \"".concat(key, "\"."));
    }
  }
}
//# sourceMappingURL=convertToJson.js.map