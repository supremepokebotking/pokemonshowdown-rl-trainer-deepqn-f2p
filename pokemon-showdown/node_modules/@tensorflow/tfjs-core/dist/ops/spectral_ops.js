"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../environment");
var complex_ops_1 = require("../ops/complex_ops");
var operation_1 = require("../ops/operation");
var util_1 = require("../util");
var tensor_ops_1 = require("./tensor_ops");
function fft_(input) {
    util_1.assert(input.dtype === 'complex64', "The dtype for tf.spectral.fft() must be complex64 " +
        ("but got " + input.dtype + "."));
    var innerDimensionSize = input.shape[input.shape.length - 1];
    var batch = input.size / innerDimensionSize;
    var input2D = input.as2D(batch, innerDimensionSize);
    var ret = environment_1.ENV.engine.runKernel(function (backend) { return backend.fft(input2D); }, { input: input });
    return ret.reshape(input.shape);
}
function ifft_(input) {
    util_1.assert(input.dtype === 'complex64', "The dtype for tf.spectral.ifft() must be complex64 " +
        ("but got " + input.dtype + "."));
    var innerDimensionSize = input.shape[input.shape.length - 1];
    var batch = input.size / innerDimensionSize;
    var input2D = input.as2D(batch, innerDimensionSize);
    var ret = environment_1.ENV.engine.runKernel(function (backend) { return backend.ifft(input2D); }, { input: input });
    return ret.reshape(input.shape);
}
function rfft_(input) {
    util_1.assert(input.dtype === 'float32', "The dtype for rfft() must be real value but\n    got " + input.dtype);
    var innerDimensionSize = input.shape[input.shape.length - 1];
    var batch = input.size / innerDimensionSize;
    var zeros = input.zerosLike();
    var complexInput = complex_ops_1.complex(input, zeros).as2D(batch, innerDimensionSize);
    var ret = exports.fft(complexInput);
    var half = Math.floor(innerDimensionSize / 2) + 1;
    var realValues = complex_ops_1.real(ret);
    var imagValues = complex_ops_1.imag(ret);
    var realComplexConjugate = realValues.split([half, innerDimensionSize - half], realValues.shape.length - 1);
    var imagComplexConjugate = imagValues.split([half, innerDimensionSize - half], imagValues.shape.length - 1);
    var outputShape = input.shape.slice();
    outputShape[input.shape.length - 1] = half;
    return complex_ops_1.complex(realComplexConjugate[0], imagComplexConjugate[0])
        .reshape(outputShape);
}
function irfft_(input) {
    var innerDimensionSize = input.shape[input.shape.length - 1];
    var batch = input.size / innerDimensionSize;
    if (innerDimensionSize <= 2) {
        var complexInput = input.as2D(batch, innerDimensionSize);
        var ret = exports.ifft(complexInput);
        return complex_ops_1.real(ret);
    }
    else {
        var outputShape = [batch, 2 * (innerDimensionSize - 1)];
        var realInput = complex_ops_1.real(input).as2D(batch, innerDimensionSize);
        var imagInput = complex_ops_1.imag(input).as2D(batch, innerDimensionSize);
        var realConjugate = realInput.slice([0, 1], [batch, innerDimensionSize - 2]).reverse(1);
        var imagConjugate = imagInput.slice([0, 1], [batch, innerDimensionSize - 2])
            .reverse(1)
            .mul(tensor_ops_1.scalar(-1));
        var r = realInput.concat(realConjugate, 1);
        var i = imagInput.concat(imagConjugate, 1);
        var complexInput = complex_ops_1.complex(r, i).as2D(outputShape[0], outputShape[1]);
        var ret = exports.ifft(complexInput);
        return complex_ops_1.real(ret);
    }
}
exports.fft = operation_1.op({ fft_: fft_ });
exports.ifft = operation_1.op({ ifft_: ifft_ });
exports.rfft = operation_1.op({ rfft_: rfft_ });
exports.irfft = operation_1.op({ irfft_: irfft_ });
//# sourceMappingURL=spectral_ops.js.map