"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
var util_1 = require("../util");
function generateCaseInputs(totalSizeTensor, totalSizeFilter) {
    var inp = new Array(totalSizeTensor);
    var filt = new Array(totalSizeFilter);
    for (var i = 0; i < totalSizeTensor; i++) {
        inp[i] = (i + 1) / totalSizeTensor;
    }
    for (var i = 0; i < totalSizeFilter; i++) {
        filt[i] = (i + 1) / totalSizeFilter;
    }
    return { input: inp, filter: filt };
}
function generateGradientCaseInputs(totalSizeTensor, totalSizeFilter) {
    var inp = new Array(totalSizeTensor);
    var filt = new Array(totalSizeFilter);
    for (var i = 0; i < totalSizeTensor; i++) {
        inp[i] = i + 1;
    }
    for (var i = 0; i < totalSizeFilter; i++) {
        filt[i] = i + 1;
    }
    return { input: inp, filter: filt };
}
function runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fDepth, fHeight, fWidth, pad, stride) {
    var inputShape = [batch, inDepth, inHeight, inWidth, inChannels];
    var filterShape = [fDepth, fHeight, fWidth, inChannels, outChannels];
    var totalSizeTensor = util_1.sizeFromShape(inputShape);
    var totalSizeFilter = util_1.sizeFromShape(filterShape);
    var inputs = generateCaseInputs(totalSizeTensor, totalSizeFilter);
    var x = tf.tensor5d(inputs.input, inputShape);
    var w = tf.tensor5d(inputs.filter, filterShape);
    var result = tf.conv3d(x, w, stride, pad);
    return result;
}
function runGradientConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fDepth, fHeight, fWidth, pad, stride) {
    var inputShape = [batch, inDepth, inHeight, inWidth, inChannels];
    var filterShape = [fDepth, fHeight, fWidth, inChannels, outChannels];
    var totalSizeTensor = util_1.sizeFromShape(inputShape);
    var totalSizeFilter = util_1.sizeFromShape(filterShape);
    var inputs = generateGradientCaseInputs(totalSizeTensor, totalSizeFilter);
    var x = tf.tensor5d(inputs.input, inputShape);
    var w = tf.tensor5d(inputs.filter, filterShape);
    var grads = tf.grads(function (x, filter) { return tf.conv3d(x, filter, stride, pad); });
    var _a = grads([x, w]), dx = _a[0], dfilter = _a[1];
    expect(dx.shape).toEqual(x.shape);
    expect(dfilter.shape).toEqual(w.shape);
    return [dx, dfilter];
}
jasmine_util_1.describeWithFlags('conv3d', test_util_1.ALL_ENVS, function () {
    it('x=[1, 2, 3, 1, 3] f=[1, 1, 1, 3, 3] s=1 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 2;
        var inHeight = 3;
        var inWidth = 1;
        var inChannels = 3;
        var outChannels = 3;
        var fSize = 1;
        var pad = 'valid';
        var stride = 1;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            0.18518519, 0.22222222, 0.25925926, 0.40740741, 0.5, 0.59259259,
            0.62962963, 0.77777778, 0.92592593, 0.85185185, 1.05555556, 1.25925926,
            1.07407407, 1.33333333, 1.59259259, 1.2962963, 1.61111111, 1.92592593
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 2, 1, 3, 3] f=[1, 1, 1, 3, 3] s=1 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 2;
        var inHeight = 1;
        var inWidth = 3;
        var inChannels = 3;
        var outChannels = 3;
        var fSize = 1;
        var pad = 'valid';
        var stride = 1;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            0.18518519, 0.22222222, 0.25925926, 0.40740741, 0.5, 0.59259259,
            0.62962963, 0.77777778, 0.92592593, 0.85185185, 1.05555556, 1.25925926,
            1.07407407, 1.33333333, 1.59259259, 1.2962963, 1.61111111, 1.92592593
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 1, 2, 3, 3] f=[1, 1, 1, 3, 3] s=1 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 1;
        var inHeight = 2;
        var inWidth = 3;
        var inChannels = 3;
        var outChannels = 3;
        var fSize = 1;
        var pad = 'valid';
        var stride = 1;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            0.18518519, 0.22222222, 0.25925926, 0.40740741, 0.5, 0.59259259,
            0.62962963, 0.77777778, 0.92592593, 0.85185185, 1.05555556, 1.25925926,
            1.07407407, 1.33333333, 1.59259259, 1.2962963, 1.61111111, 1.92592593
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 4, 2, 3, 3] f=[2, 2, 2, 3, 3] s=1 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 4;
        var inHeight = 2;
        var inWidth = 3;
        var inChannels = 3;
        var outChannels = 3;
        var fSize = 2;
        var pad = 'valid';
        var stride = 1;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            3.77199074, 3.85069444, 3.92939815, 4.2650463, 4.35763889, 4.45023148,
            6.73032407, 6.89236111, 7.05439815, 7.22337963, 7.39930556, 7.57523148,
            9.68865741, 9.93402778, 10.17939815, 10.18171296, 10.44097222, 10.70023148
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 5, 8, 7, 1] f=[1, 2, 3, 1, 1] s=[2, 3, 1] d=1 p=same', function () {
        var batch = 1;
        var inDepth = 5;
        var inHeight = 8;
        var inWidth = 7;
        var inChannels = 1;
        var outChannels = 1;
        var fDepth = 1;
        var fHeight = 2;
        var fWidth = 3;
        var pad = 'same';
        var stride = [2, 3, 1];
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fDepth, fHeight, fWidth, pad, stride);
        var expectedOutput = [
            0.06071429, 0.08988095, 0.10238095, 0.11488095, 0.12738095, 0.13988095,
            0.08452381, 0.26071429, 0.35238095, 0.36488095, 0.37738095, 0.38988095,
            0.40238095, 0.23452381, 0.46071429, 0.61488095, 0.62738095, 0.63988095,
            0.65238095, 0.66488095, 0.38452381, 1.12738095, 1.48988095, 1.50238095,
            1.51488095, 1.52738095, 1.53988095, 0.88452381, 1.32738095, 1.75238095,
            1.76488095, 1.77738095, 1.78988095, 1.80238095, 1.03452381, 1.52738095,
            2.01488095, 2.02738095, 2.03988095, 2.05238095, 2.06488095, 1.18452381,
            2.19404762, 2.88988095, 2.90238095, 2.91488095, 2.92738095, 2.93988095,
            1.68452381, 2.39404762, 3.15238095, 3.16488095, 3.17738095, 3.18988095,
            3.20238095, 1.83452381, 2.59404762, 3.41488095, 3.42738095, 3.43988095,
            3.45238095, 3.46488095, 1.98452381
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 4, 2, 3, 3] f=[2, 2, 2, 3, 3] s=2 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 4;
        var inHeight = 2;
        var inWidth = 3;
        var inChannels = 3;
        var outChannels = 3;
        var fSize = 2;
        var pad = 'valid';
        var stride = 2;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            3.77199074, 3.85069444, 3.92939815, 9.68865741, 9.93402778, 10.17939815
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 6, 7, 8, 2] f=[3, 2, 1, 2, 3] s=3 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 6;
        var inHeight = 7;
        var inWidth = 8;
        var inChannels = 2;
        var outChannels = 3;
        var fDepth = 3;
        var fHeight = 2;
        var fWidth = 1;
        var pad = 'valid';
        var stride = 3;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fDepth, fHeight, fWidth, pad, stride);
        var expectedOutput = [
            1.51140873, 1.57167659, 1.63194444, 1.56349206, 1.62673611, 1.68998016,
            1.6155754, 1.68179563, 1.74801587, 1.9280754, 2.01215278, 2.09623016,
            1.98015873, 2.0672123, 2.15426587, 2.03224206, 2.12227183, 2.21230159,
            4.4280754, 4.65500992, 4.88194444, 4.48015873, 4.71006944, 4.93998016,
            4.53224206, 4.76512897, 4.99801587, 4.84474206, 5.09548611, 5.34623016,
            4.8968254, 5.15054563, 5.40426587, 4.94890873, 5.20560516, 5.46230159
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 4, 2, 3, 3] f=[2, 2, 2, 3, 3] s=2 d=1 p=same', function () {
        var batch = 1;
        var inDepth = 4;
        var inHeight = 2;
        var inWidth = 3;
        var inChannels = 3;
        var outChannels = 3;
        var fSize = 2;
        var pad = 'same';
        var stride = 2;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            3.77199074, 3.85069444, 3.92939815, 2.0162037, 2.06597222, 2.11574074,
            9.68865741, 9.93402778, 10.17939815, 4.59953704, 4.73263889, 4.86574074
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 3, 3, 3, 1] f=[1, 1, 1, 1, 1] s=2 d=1 p=same', function () {
        var batch = 1;
        var inDepth = 3;
        var inHeight = 3;
        var inWidth = 3;
        var inChannels = 1;
        var outChannels = 1;
        var fSize = 1;
        var pad = 'same';
        var stride = 2;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            0.03703704, 0.11111111, 0.25925926, 0.33333333, 0.7037037, 0.77777778,
            0.92592593, 1.
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 3, 3, 3, 1] f=[1, 1, 1, 1, 1] s=2 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 3;
        var inHeight = 3;
        var inWidth = 3;
        var inChannels = 1;
        var outChannels = 1;
        var fSize = 1;
        var pad = 'valid';
        var stride = 2;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            0.03703704, 0.11111111, 0.25925926, 0.33333333, 0.7037037, 0.77777778,
            0.92592593, 1.
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 7, 7, 7, 1] f=[2, 2, 2, 1, 1] s=3 d=1 p=same', function () {
        var batch = 1;
        var inDepth = 7;
        var inHeight = 7;
        var inWidth = 7;
        var inChannels = 1;
        var outChannels = 1;
        var fSize = 2;
        var pad = 'same';
        var stride = 3;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            0.54081633, 0.58017493, 0.28061224, 0.81632653, 0.85568513, 0.40306122,
            0.41873178, 0.4340379, 0.19642857, 2.46938776, 2.50874636, 1.1377551,
            2.74489796, 2.78425656, 1.26020408, 1.16873178, 1.1840379, 0.51785714,
            1.09511662, 1.10604956, 0.44642857, 1.17164723, 1.18258017, 0.47704082,
            0.3691691, 0.37244898, 0.125
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 7, 7, 7, 1] f=[2, 2, 2, 1, 1] s=3 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 7;
        var inHeight = 7;
        var inWidth = 7;
        var inChannels = 1;
        var outChannels = 1;
        var fSize = 2;
        var pad = 'valid';
        var stride = 3;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fSize, fSize, fSize, pad, stride);
        var expectedOutput = [
            0.540816, 0.580175, 0.816327, 0.855685, 2.469388, 2.508746, 2.744898,
            2.784257
        ];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('x=[1, 2, 1, 2, 1] f=[2, 1, 2, 1, 2] s=1 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 2;
        var inHeight = 1;
        var inWidth = 2;
        var inChannels = 1;
        var outChannels = 2;
        var fDepth = 2;
        var fHeight = 1;
        var fWidth = 2;
        var pad = 'valid';
        var stride = 1;
        var result = runConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fDepth, fHeight, fWidth, pad, stride);
        var expectedOutput = [1.5625, 1.875];
        test_util_1.expectArraysClose(result, expectedOutput);
    });
    it('gradient check, x=[1,3,6,1,1] filter=[2,2,1,1,1] s=1 d=1 p=valid', function () {
        var batch = 1;
        var inDepth = 3;
        var inHeight = 6;
        var inWidth = 1;
        var inChannels = 1;
        var outChannels = 1;
        var fDepth = 2;
        var fHeight = 2;
        var fWidth = 1;
        var pad = 'valid';
        var stride = 1;
        var _a = runGradientConv3DTestCase(batch, inDepth, inHeight, inWidth, inChannels, outChannels, fDepth, fHeight, fWidth, pad, stride), dx = _a[0], dfilter = _a[1];
        var expectedFilterOutput = [60.0, 70.0, 120.0, 130.0];
        var expectedOutput = [
            1.0, 3.0, 3.0, 3.0, 3.0, 2.0, 4.0, 10.0, 10.0, 10.0, 10.0, 6.0, 3.0, 7.0,
            7.0, 7.0, 7.0, 4.0
        ];
        test_util_1.expectArraysClose(dx, expectedOutput);
        test_util_1.expectArraysClose(dfilter, expectedFilterOutput);
    });
    it('throws when passed x as a non-tensor', function () {
        var inputDepth = 1;
        var outputDepth = 1;
        var fSize = 1;
        var pad = 'valid';
        var stride = 1;
        var w = tf.tensor5d([2], [fSize, fSize, fSize, inputDepth, outputDepth]);
        expect(function () { return tf.conv3d({}, w, stride, pad); })
            .toThrowError(/Argument 'x' passed to 'conv3d' must be a Tensor/);
    });
    it('throws when passed filter as a non-tensor', function () {
        var inputDepth = 1;
        var inputShape = [2, 2, 1, inputDepth];
        var pad = 'valid';
        var stride = 1;
        var x = tf.tensor4d([1, 2, 3, 4], inputShape);
        expect(function () { return tf.conv3d(x, {}, stride, pad); })
            .toThrowError(/Argument 'filter' passed to 'conv3d' must be a Tensor/);
    });
    it('accepts a tensor-like object', function () {
        var pad = 'valid';
        var stride = 1;
        var x = [[[[1], [2]], [[3], [4]]]];
        var w = [[[[[2]]]]];
        var result = tf.conv3d(x, w, stride, pad);
        test_util_1.expectArraysClose(result, [2, 4, 6, 8]);
    });
});
//# sourceMappingURL=conv3d_test.js.map