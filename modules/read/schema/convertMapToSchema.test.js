import convertMapToSchema from './convertMapToSchema.js';
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
    convertMapToSchema(map).should.deep.equal({
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