"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constraints_1 = require("./constraints");
function maxNorm(args) {
    return new constraints_1.MaxNorm(args);
}
exports.maxNorm = maxNorm;
function unitNorm(args) {
    return new constraints_1.UnitNorm(args);
}
exports.unitNorm = unitNorm;
function nonNeg() {
    return new constraints_1.NonNeg();
}
exports.nonNeg = nonNeg;
function minMaxNorm(config) {
    return new constraints_1.MinMaxNorm(config);
}
exports.minMaxNorm = minMaxNorm;
//# sourceMappingURL=exports_constraints.js.map