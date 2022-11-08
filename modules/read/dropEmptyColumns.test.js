import dropEmptyColumns from './dropEmptyColumns.js';
describe('dropEmptyColumns', function () {
  it('should drop empty columns (only at the end)', function () {
    dropEmptyColumns([[null, 'A', 'B', 'C', null, null], [null, 'D', null, null, null, null], [null, null, null, null, null, null], [null, null, 'E', 'F', 'G', null]], {
      onlyTrimAtTheEnd: true
    }).should.deep.equal([[null, 'A', 'B', 'C', null], [null, 'D', null, null, null], [null, null, null, null, null], [null, null, 'E', 'F', 'G']]);
  });
  it('should drop empty columns', function () {
    dropEmptyColumns([[null, 'A', 'B', 'C', null, null], [null, 'D', null, null, null, null], [null, null, null, null, null, null], [null, null, 'E', 'F', 'G', null]]).should.deep.equal([['A', 'B', 'C', null], ['D', null, null, null], [null, null, null, null], [null, 'E', 'F', 'G']]);
  });
});
//# sourceMappingURL=dropEmptyColumns.test.js.map