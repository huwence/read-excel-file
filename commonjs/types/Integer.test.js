"use strict";

var _Integer = require("./Integer.js");
describe('Integer', function () {
  it('should validate an Integer', function () {
    // isInteger('1.2').should.equal(false)
    // isInteger('1').should.equal(true)
    (0, _Integer.isInteger)(1.2).should.equal(false);
    (0, _Integer.isInteger)(1).should.equal(true);
  });
});
//# sourceMappingURL=Integer.test.js.map