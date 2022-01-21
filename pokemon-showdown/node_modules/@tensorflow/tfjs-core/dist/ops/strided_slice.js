"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var tensor_util_env_1 = require("../tensor_util_env");
var operation_1 = require("./operation");
var slice_1 = require("./slice");
var slice_util_1 = require("./slice_util");
function stridedSlice_(x, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
    if (beginMask === void 0) { beginMask = 0; }
    if (endMask === void 0) { endMask = 0; }
    if (ellipsisMask === void 0) { ellipsisMask = 0; }
    if (newAxisMask === void 0) { newAxisMask = 0; }
    if (shrinkAxisMask === void 0) { shrinkAxisMask = 0; }
    if (ellipsisMask !== 0) {
        throw new Error('ellipsis mask is not yet supported');
    }
    if (newAxisMask !== 0) {
        throw new Error('new axis mask is not yet supported');
    }
    var $x = tensor_util_env_1.convertToTensor(x, 'x', 'stridedSlice');
    var nonStrided = strides.every(function (v) { return v === 1; });
    if (nonStrided) {
        var _a = slice_util_1.getStridedSlicedInfo($x.shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask), beginIndex = _a[0], size = _a[1], shrinkAxis_1 = _a[2];
        var outShape = size.filter(function (_, index) { return shrinkAxis_1.indexOf(index) === -1; });
        return slice_1.slice($x, beginIndex, size).reshape(outShape);
    }
    return environment_1.ENV.engine.runKernel(function (backend) { return backend.stridedSlice($x, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask); }, { $x: $x });
}
exports.stridedSlice = operation_1.op({ stridedSlice_: stridedSlice_ });
//# sourceMappingURL=strided_slice.js.map