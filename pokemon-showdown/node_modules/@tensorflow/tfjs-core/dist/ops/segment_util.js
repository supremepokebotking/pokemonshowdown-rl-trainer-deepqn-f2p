"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var reduce_util_1 = require("./reduce_util");
function segOpComputeOptimalWindowSize(inSize, numSegments) {
    var done = false;
    var res;
    if (inSize <= reduce_util_1.PARALLELIZE_THRESHOLD) {
        res = inSize;
        done = true;
    }
    else {
        res = util_1.nearestDivisor(inSize, Math.floor(Math.sqrt(inSize)));
    }
    while (!done) {
        if (res > numSegments || res === inSize) {
            done = true;
            break;
        }
        else {
            res = util_1.nearestDivisor(inSize, res + 1);
        }
    }
    return res;
}
exports.segOpComputeOptimalWindowSize = segOpComputeOptimalWindowSize;
function computeOutShape(aShape, axis, numSegments) {
    var outShape = [];
    var rank = aShape.length;
    for (var dim = 0; dim < rank; dim++) {
        if (dim !== axis) {
            outShape.push(aShape[dim]);
        }
        else {
            outShape.push(numSegments);
        }
    }
    return outShape;
}
exports.computeOutShape = computeOutShape;
function collectGatherOpShapeInfo(x, indices, axis) {
    var dimSize = x.shape[axis];
    var outputShape = [];
    var batchSize = 1;
    var sliceSize = 1;
    for (var i = 0; i < axis; i++) {
        outputShape.push(x.shape[i]);
        batchSize *= x.shape[i];
    }
    for (var i = 0; i < indices.rank; i++) {
        outputShape.push(indices.shape[i]);
    }
    for (var i = axis + 1; i < x.rank; i++) {
        outputShape.push(x.shape[i]);
        sliceSize *= x.shape[i];
    }
    return { batchSize: batchSize, sliceSize: sliceSize, dimSize: dimSize, outputShape: outputShape };
}
exports.collectGatherOpShapeInfo = collectGatherOpShapeInfo;
//# sourceMappingURL=segment_util.js.map