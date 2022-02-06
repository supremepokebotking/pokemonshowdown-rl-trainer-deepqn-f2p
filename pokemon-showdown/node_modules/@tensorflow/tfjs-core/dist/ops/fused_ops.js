"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var operation_1 = require("../ops/operation");
var tensor_util_1 = require("../tensor_util");
var tensor_util_env_1 = require("../tensor_util_env");
var util = require("../util");
var broadcast_util = require("./broadcast_util");
function matMul_(a, b, transposeA, transposeB, bias, activation) {
    if (transposeA === void 0) { transposeA = false; }
    if (transposeB === void 0) { transposeB = false; }
    if (activation === void 0) { activation = 'linear'; }
    var _a;
    var $a = tensor_util_env_1.convertToTensor(a, 'a', 'fused matMul');
    var $b = tensor_util_env_1.convertToTensor(b, 'b', 'fused matMul');
    _a = tensor_util_1.makeTypesMatch($a, $b), $a = _a[0], $b = _a[1];
    var innerShapeA = transposeA ? $a.shape[$a.rank - 2] : $a.shape[$a.rank - 1];
    var innerShapeB = transposeB ? $b.shape[$b.rank - 1] : $b.shape[$b.rank - 2];
    var outerShapeA = transposeA ? $a.shape[$a.rank - 1] : $a.shape[$a.rank - 2];
    var outerShapeB = transposeB ? $b.shape[$b.rank - 2] : $b.shape[$b.rank - 1];
    var outerDimsA = $a.shape.slice(0, -2);
    var outerDimsB = $b.shape.slice(0, -2);
    var batchDimA = util.sizeFromShape(outerDimsA);
    var batchDimB = util.sizeFromShape(outerDimsB);
    util.assert($a.rank >= 2 && $b.rank >= 2 && $a.rank === $b.rank, "Error in fused matMul: inputs must have the same rank of at least 2, " +
        ("got ranks " + $a.rank + " and " + $b.rank + "."));
    util.assert(util.arraysEqual(outerDimsA, outerDimsB), "Error in fused matMul: outer dimensions (" + outerDimsA + ") and (" +
        (outerDimsB + ") of Tensors with shapes " + $a.shape + " and ") +
        ($b.shape + " must match."));
    util.assert(innerShapeA === innerShapeB, "Error in fused matMul: inner shapes (" + innerShapeA + ") and (" +
        (innerShapeB + ") of Tensors with shapes " + $a.shape + " and ") +
        ($b.shape + " and transposeA=" + transposeA) +
        (" and transposeB=" + transposeB + " must match."));
    var outShape = $a.shape.slice(0, -2).concat([outerShapeA, outerShapeB]);
    var a3D = transposeA ? $a.as3D(batchDimA, innerShapeA, outerShapeA) :
        $a.as3D(batchDimA, outerShapeA, innerShapeA);
    var b3D = transposeB ? $b.as3D(batchDimB, outerShapeB, innerShapeB) :
        $b.as3D(batchDimB, innerShapeB, outerShapeB);
    var $bias;
    if (bias != null) {
        $bias = tensor_util_env_1.convertToTensor(bias, 'bias', 'fused matMul');
        $bias = tensor_util_1.makeTypesMatch($bias, $a)[0];
        broadcast_util.assertAndGetBroadcastShape(outShape, $bias.shape);
    }
    var grad = function (dy, saved) {
        var y = saved[0];
        var dyActivation;
        if (activation == null || activation === 'linear') {
            dyActivation = dy;
        }
        else if (activation === 'relu') {
            dyActivation = dy.mul(y.step());
        }
        else {
            throw new Error("Gradient for activation " + activation + " has not been " +
                "implemented yet.");
        }
        var biasGradient = {};
        if (bias != null) {
            biasGradient = {
                $bias: function () {
                    var res = dyActivation;
                    var reduceAxes = broadcast_util.getReductionAxes($bias.shape, outShape);
                    if (reduceAxes.length > 0) {
                        res = res.sum(reduceAxes);
                    }
                    return res.reshape($bias.shape);
                }
            };
        }
        if (!transposeA && !transposeB) {
            return Object.assign({
                $a: function () { return dyActivation.matMul(b3D, false, true); },
                $b: function () { return a3D.matMul(dyActivation, true, false); }
            }, biasGradient);
        }
        else if (!transposeA && transposeB) {
            return Object.assign({
                $a: function () { return dyActivation.matMul(b3D, false, false); },
                $b: function () { return dyActivation.matMul(a3D, true, false); }
            }, biasGradient);
        }
        else if (transposeA && !transposeB) {
            return Object.assign({
                $a: function () { return b3D.matMul(dyActivation, false, true); },
                $b: function () { return a3D.matMul(dyActivation, false, false); }
            }, biasGradient);
        }
        else {
            return Object.assign({
                $a: function () { return b3D.matMul(dyActivation, true, true); },
                $b: function () { return dyActivation.matMul(a3D, true, true); }
            }, biasGradient);
        }
    };
    var inputs = { $a: a3D, $b: b3D };
    if (bias != null) {
        inputs.$bias = $bias;
    }
    var res = environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.fusedBatchMatMul(a3D, b3D, transposeA, transposeB, $bias, activation)); }, inputs, grad);
    return res.reshape(outShape);
}
exports.matMul = operation_1.op({ matMul_: matMul_ });
//# sourceMappingURL=fused_ops.js.map