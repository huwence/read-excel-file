"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _xmldom = require("@xmldom/xmldom");
var _default = {
  createDocument: function createDocument(content) {
    return new _xmldom.DOMParser().parseFromString(content);
  }
};
exports["default"] = _default;
//# sourceMappingURL=xml.js.map