"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initializers_1 = require("./initializers");
function zeros() {
    return new initializers_1.Zeros();
}
exports.zeros = zeros;
function ones() {
    return new initializers_1.Ones();
}
exports.ones = ones;
function constant(args) {
    return new initializers_1.Constant(args);
}
exports.constant = constant;
function randomUniform(args) {
    return new initializers_1.RandomUniform(args);
}
exports.randomUniform = randomUniform;
function randomNormal(args) {
    return new initializers_1.RandomNormal(args);
}
exports.randomNormal = randomNormal;
function truncatedNormal(args) {
    return new initializers_1.TruncatedNormal(args);
}
exports.truncatedNormal = truncatedNormal;
function identity(args) {
    return new initializers_1.Identity(args);
}
exports.identity = identity;
function varianceScaling(config) {
    return new initializers_1.VarianceScaling(config);
}
exports.varianceScaling = varianceScaling;
function glorotUniform(args) {
    return new initializers_1.GlorotUniform(args);
}
exports.glorotUniform = glorotUniform;
function glorotNormal(args) {
    return new initializers_1.GlorotNormal(args);
}
exports.glorotNormal = glorotNormal;
function heNormal(args) {
    return new initializers_1.HeNormal(args);
}
exports.heNormal = heNormal;
function heUniform(args) {
    return new initializers_1.HeUniform(args);
}
exports.heUniform = heUniform;
function leCunNormal(args) {
    return new initializers_1.LeCunNormal(args);
}
exports.leCunNormal = leCunNormal;
function leCunUniform(args) {
    return new initializers_1.LeCunUniform(args);
}
exports.leCunUniform = leCunUniform;
function orthogonal(args) {
    return new initializers_1.Orthogonal(args);
}
exports.orthogonal = orthogonal;
//# sourceMappingURL=exports_initializers.js.map