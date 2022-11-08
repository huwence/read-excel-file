import path from 'path';
import readSheetNamesNode from './readSheetNamesNode.js';
describe('readSheetNamesNode', function () {
  it('should read the list of sheet names in an *.xlsx file in Node.js', function () {
    return readSheetNamesNode(path.resolve('./test/spreadsheets/multiple-sheets.xlsx')).then(function (sheetNames) {
      sheetNames.should.deep.equal(['sheet 1', 'sheet 2']);
    });
  });
});
//# sourceMappingURL=readSheetNamesNode.test.js.map