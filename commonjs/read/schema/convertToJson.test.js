"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _convertToJson18 = _interopRequireWildcard(require("./convertToJson.js"));
var _Integer = _interopRequireDefault(require("../../types/Integer.js"));
var _URL = _interopRequireDefault(require("../../types/URL.js"));
var _Email = _interopRequireDefault(require("../../types/Email.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var date = convertToUTCTimezone(new Date(2018, 3 - 1, 24));
describe('convertToJson', function () {
  it('should parse arrays', function () {
    (0, _convertToJson18.getBlock)('abc"de,f"g,h', ',', 0).should.deep.equal(['abcde,fg', 10]);
    (0, _convertToJson18.parseArray)(' abc"de,f"g  , h ').should.deep.equal(['abcde,fg', 'h']);
  });
  it('should convert to json', function () {
    var _convertToJson = (0, _convertToJson18["default"])([['DATE', 'NUMBER', 'BOOLEAN', 'STRING', 'PHONE', 'PHONE_TYPE'], [new Date(Date.parse('03/24/2018') - new Date().getTimezoneOffset() * 60 * 1000),
      // '43183', // '03/24/2018',
      '123', true, 'abc', '(123) 456-7890', '(123) 456-7890']], {
        DATE: {
          prop: 'date',
          type: Date
        },
        NUMBER: {
          prop: 'number',
          type: Number
        },
        BOOLEAN: {
          prop: 'boolean',
          type: Boolean
        },
        STRING: {
          prop: 'string',
          type: String
        },
        PHONE: {
          prop: 'phone',
          parse: function parse(value) {
            return '+11234567890';
          }
        },
        PHONE_TYPE: {
          prop: 'phoneType',
          type: function type(value) {
            return '+11234567890';
          }
        }
      }),
      rows = _convertToJson.rows,
      errors = _convertToJson.errors;
    errors.should.deep.equal([]);

    // Convert `Date` to `String` for equality check.
    rows[0].date = rows[0].date.toISOString();
    rows.should.deep.equal([{
      date: date.toISOString(),
      number: 123,
      phone: '+11234567890',
      phoneType: '+11234567890',
      "boolean": true,
      string: 'abc'
    }]);
  });
  it('should support schema entries with no `type`s', function () {
    var _convertToJson2 = (0, _convertToJson18["default"])([['DATE', 'NUMBER', 'BOOLEAN', 'STRING'], [new Date(Date.parse('03/24/2018') - new Date().getTimezoneOffset() * 60 * 1000),
      // '43183', // '03/24/2018',
      123, true, 'abc']], {
        DATE: {
          prop: 'date'
        },
        NUMBER: {
          prop: 'number'
        },
        BOOLEAN: {
          prop: 'boolean'
        },
        STRING: {
          prop: 'string'
        }
      }),
      rows = _convertToJson2.rows,
      errors = _convertToJson2.errors;
    errors.should.deep.equal([]);

    // Convert `Date` to `String` for equality check.
    rows[0].date = rows[0].date.toISOString();
    rows.should.deep.equal([{
      date: date.toISOString(),
      number: 123,
      "boolean": true,
      string: 'abc'
    }]);
  });
  it('should require fields', function () {
    var _convertToJson3 = (0, _convertToJson18["default"])([['NUMBER'], [null]], {
        NUMBER: {
          prop: 'number',
          type: Number,
          required: true
        }
      }),
      rows = _convertToJson3.rows,
      errors = _convertToJson3.errors;
    errors.should.deep.equal([{
      error: 'required',
      row: 2,
      column: 'NUMBER',
      type: Number,
      value: null
    }]);
    rows.should.deep.equal([]);
  });
  it('should parse arrays', function () {
    var _convertToJson4 = (0, _convertToJson18["default"])([['NAMES'], ['Barack Obama, "String, with, colons", Donald Trump'], [null]], {
        NAMES: {
          prop: 'names',
          type: [String]
        }
      }),
      rows = _convertToJson4.rows,
      errors = _convertToJson4.errors;
    errors.should.deep.equal([]);
    rows.should.deep.equal([{
      names: ['Barack Obama', 'String, with, colons', 'Donald Trump']
    }]);
  });
  it('should parse integers', function () {
    var _convertToJson5 = (0, _convertToJson18["default"])([['INTEGER'], ['1'], ['1.2']], {
        INTEGER: {
          prop: 'value',
          type: _Integer["default"]
        }
      }),
      rows = _convertToJson5.rows,
      errors = _convertToJson5.errors;
    errors.length.should.equal(1);
    errors[0].should.deep.equal({
      error: 'invalid',
      reason: 'not_an_integer',
      row: 3,
      column: 'INTEGER',
      type: _Integer["default"],
      value: '1.2'
    });
    rows.should.deep.equal([{
      value: 1
    }]);
  });
  it('should parse URLs', function () {
    var _convertToJson6 = (0, _convertToJson18["default"])([['URL'], ['https://kremlin.ru'], ['kremlin.ru']], {
        URL: {
          prop: 'value',
          type: _URL["default"]
        }
      }),
      rows = _convertToJson6.rows,
      errors = _convertToJson6.errors;
    errors.length.should.equal(1);
    errors[0].row.should.equal(3);
    errors[0].column.should.equal('URL');
    errors[0].error.should.equal('invalid');
    rows.should.deep.equal([{
      value: 'https://kremlin.ru'
    }]);
  });
  it('should parse Emails', function () {
    var _convertToJson7 = (0, _convertToJson18["default"])([['EMAIL'], ['vladimir.putin@kremlin.ru'], ['123']], {
        EMAIL: {
          prop: 'value',
          type: _Email["default"]
        }
      }),
      rows = _convertToJson7.rows,
      errors = _convertToJson7.errors;
    errors.length.should.equal(1);
    errors[0].row.should.equal(3);
    errors[0].column.should.equal('EMAIL');
    errors[0].error.should.equal('invalid');
    rows.should.deep.equal([{
      value: 'vladimir.putin@kremlin.ru'
    }]);
  });
  it('should call .validate()', function () {
    var _convertToJson8 = (0, _convertToJson18["default"])([['NAME'], ['George Bush']], {
        NAME: {
          prop: 'name',
          type: String,
          required: true,
          validate: function validate(value) {
            if (value === 'George Bush') {
              throw new Error('custom-error');
            }
          }
        }
      }),
      rows = _convertToJson8.rows,
      errors = _convertToJson8.errors;
    errors.should.deep.equal([{
      error: 'custom-error',
      row: 2,
      column: 'NAME',
      type: String,
      value: 'George Bush'
    }]);
    rows.should.deep.equal([]);
  });
  it('should validate numbers', function () {
    var _convertToJson9 = (0, _convertToJson18["default"])([['NUMBER'], ['123abc']], {
        NUMBER: {
          prop: 'number',
          type: Number,
          required: true
        }
      }),
      rows = _convertToJson9.rows,
      errors = _convertToJson9.errors;
    errors.should.deep.equal([{
      error: 'invalid',
      reason: 'not_a_number',
      row: 2,
      column: 'NUMBER',
      type: Number,
      value: '123abc'
    }]);
    rows.should.deep.equal([]);
  });
  it('should validate booleans', function () {
    var _convertToJson10 = (0, _convertToJson18["default"])([['TRUE', 'FALSE', 'INVALID'], [true, false, 'TRUE']], {
        TRUE: {
          prop: 'true',
          type: Boolean,
          required: true
        },
        FALSE: {
          prop: 'false',
          type: Boolean,
          required: true
        },
        INVALID: {
          prop: 'invalid',
          type: Boolean,
          required: true
        }
      }),
      rows = _convertToJson10.rows,
      errors = _convertToJson10.errors;
    errors.should.deep.equal([{
      error: 'invalid',
      reason: 'not_a_boolean',
      row: 2,
      column: 'INVALID',
      type: Boolean,
      value: 'TRUE'
    }]);
    rows.should.deep.equal([{
      "true": true,
      "false": false
    }]);
  });
  it('should validate dates', function () {
    var _convertToJson11 = (0, _convertToJson18["default"])([['DATE', 'INVALID'], [43183,
      // 03/24/2018',
      '-'], [date,
      // 03/24/2018',,
      '-']], {
        DATE: {
          prop: 'date',
          type: Date,
          required: true
        },
        INVALID: {
          prop: 'invalid',
          type: Date,
          required: true
        }
      }),
      rows = _convertToJson11.rows,
      errors = _convertToJson11.errors;
    errors.should.deep.equal([{
      error: 'invalid',
      reason: 'not_a_date',
      row: 2,
      column: 'INVALID',
      type: Date,
      value: '-'
    }, {
      error: 'invalid',
      reason: 'not_a_date',
      row: 3,
      column: 'INVALID',
      type: Date,
      value: '-'
    }]);
    rows.should.deep.equal([{
      date: date
    }, {
      date: date
    }]);
  });
  it('should throw parse() errors', function () {
    var _convertToJson12 = (0, _convertToJson18["default"])([['PHONE', 'PHONE_TYPE'], ['123', '123']], {
        PHONE: {
          prop: 'phone',
          parse: function parse() {
            throw new Error('invalid');
          }
        },
        PHONE_TYPE: {
          prop: 'phoneType',
          parse: function parse() {
            throw new Error('invalid');
          }
        }
      }),
      rows = _convertToJson12.rows,
      errors = _convertToJson12.errors;
    errors.should.deep.equal([{
      error: 'invalid',
      row: 2,
      column: 'PHONE',
      value: '123'
    }, {
      error: 'invalid',
      row: 2,
      column: 'PHONE_TYPE',
      value: '123'
    }]);
    rows.should.deep.equal([]);
  });
  it('should map row numbers', function () {
    var _convertToJson13 = (0, _convertToJson18["default"])([['NUMBER'], ['123abc']], {
        NUMBER: {
          prop: 'number',
          type: Number
        }
      }, {
        rowMap: [2, 5]
      }),
      rows = _convertToJson13.rows,
      errors = _convertToJson13.errors;
    errors.should.deep.equal([{
      error: 'invalid',
      reason: 'not_a_number',
      row: 6,
      column: 'NUMBER',
      type: Number,
      value: '123abc'
    }]);
  });
  it('should validate "oneOf" (valid)', function () {
    var _convertToJson14 = (0, _convertToJson18["default"])([['STATUS'], ['STARTED']], {
        STATUS: {
          prop: 'status',
          type: String,
          oneOf: ['STARTED', 'FINISHED']
        }
      }),
      rows = _convertToJson14.rows,
      errors = _convertToJson14.errors;
    errors.length.should.equal(0);
  });
  it('should validate "oneOf" (not valid)', function () {
    var _convertToJson15 = (0, _convertToJson18["default"])([['STATUS'], ['SCHEDULED']], {
        STATUS: {
          prop: 'status',
          type: String,
          oneOf: ['STARTED', 'FINISHED']
        }
      }),
      rows = _convertToJson15.rows,
      errors = _convertToJson15.errors;
    errors.should.deep.equal([{
      error: 'invalid',
      reason: 'unknown',
      row: 2,
      column: 'STATUS',
      type: String,
      value: 'SCHEDULED'
    }]);
  });
  it('should not include `null` values by default', function () {
    var _convertToJson16 = (0, _convertToJson18["default"])([['A', 'B', 'CA', 'CB'], ['a', 'b', 'ca', null], ['a', null]], {
        A: {
          prop: 'a',
          type: String
        },
        B: {
          prop: 'b',
          type: String
        },
        C: {
          prop: 'c',
          type: {
            CA: {
              prop: 'a',
              type: String
            },
            CB: {
              prop: 'b',
              type: String
            }
          }
        }
      }),
      rows = _convertToJson16.rows;
    rows.should.deep.equal([{
      a: 'a',
      b: 'b',
      c: {
        a: 'ca'
      }
    }, {
      a: 'a'
    }]);
  });
  it('should include `null` values when `includeNullValues: true` option is passed', function () {
    var _convertToJson17 = (0, _convertToJson18["default"])([['A', 'B', 'CA', 'CB'], ['a', 'b', 'ca', null], ['a', null]], {
        A: {
          prop: 'a',
          type: String
        },
        B: {
          prop: 'b',
          type: String
        },
        C: {
          prop: 'c',
          type: {
            CA: {
              prop: 'a',
              type: String
            },
            CB: {
              prop: 'b',
              type: String
            }
          }
        }
      }, {
        includeNullValues: true
      }),
      rows = _convertToJson17.rows;
    rows.should.deep.equal([{
      a: 'a',
      b: 'b',
      c: {
        a: 'ca',
        b: null
      }
    }, {
      a: 'a',
      b: null,
      c: null
    }]);
  });
});

// Converts timezone to UTC while preserving the same time
function convertToUTCTimezone(date) {
  // Doesn't account for leap seconds but I guess that's ok
  // given that javascript's own `Date()` does not either.
  // https://www.timeanddate.com/time/leap-seconds-background.html
  //
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  //
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}
//# sourceMappingURL=convertToJson.test.js.map