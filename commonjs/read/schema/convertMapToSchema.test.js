"use strict";

var _convertMapToSchema = _interopRequireDefault(require("./convertMapToSchema.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
describe('convertMapToSchema', function () {
  it('should convert map to schema', function () {
    var map = {
      'START DATE': 'date',
      'NUMBER OF STUDENTS': 'numberOfStudents',
      'COURSE': {
        'course': {
          'IS FREE': 'isFree',
          'COURSE TITLE': 'title'
        }
      },
      'CONTACT': 'contact',
      'STATUS': 'status'
    };
    (0, _convertMapToSchema["default"])(map).should.deep.equal({
      'START DATE': {
        prop: 'date'
      },
      'NUMBER OF STUDENTS': {
        prop: 'numberOfStudents'
      },
      'COURSE': {
        prop: 'course',
        type: {
          'IS FREE': {
            prop: 'isFree'
          },
          'COURSE TITLE': {
            prop: 'title'
          }
        }
      },
      'CONTACT': {
        prop: 'contact'
      },
      'STATUS': {
        prop: 'status'
      }
    });
  });
});
//# sourceMappingURL=convertMapToSchema.test.js.map