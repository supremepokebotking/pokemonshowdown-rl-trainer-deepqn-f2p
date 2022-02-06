"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../../index");
var jasmine_util_1 = require("../../jasmine_util");
var test_util_1 = require("../../test_util");
jasmine_util_1.describeWithFlags('expensive reshape', test_util_1.PACKED_ENVS, function () {
    var cValues = [46, 52, 58, 64, 70, 100, 115, 130, 145, 160, 154, 178, 202, 226, 250];
    var c;
    beforeEach(function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 3]);
        var b = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [3, 5]);
        c = tf.matMul(a, b);
    });
    it('6d --> 1d', function () {
        var cAs6D = tf.reshape(c, [1, 1, 1, 3, 1, 5]);
        var cAs1D = tf.reshape(cAs6D, [-1, cValues.length]);
        test_util_1.expectArraysClose(cAs1D, cValues);
    });
    it('1d --> 2d', function () {
        var cAs1D = tf.reshape(c, [cValues.length]);
        var cAs2D = tf.reshape(cAs1D, [5, -1]);
        test_util_1.expectArraysClose(cAs2D, cValues);
    });
    it('2d --> 3d', function () {
        var cAs3D = tf.reshape(c, [3, 1, 5]);
        test_util_1.expectArraysClose(cAs3D, cValues);
    });
    it('3d --> 4d', function () {
        var cAs3D = tf.reshape(c, [3, 1, 5]);
        var cAs4D = tf.reshape(cAs3D, [3, 5, 1, 1]);
        test_util_1.expectArraysClose(cAs4D, cValues);
    });
    it('4d --> 5d', function () {
        var cAs4D = tf.reshape(c, [3, 5, 1, 1]);
        var cAs5D = tf.reshape(cAs4D, [1, 1, 1, 5, 3]);
        test_util_1.expectArraysClose(cAs5D, cValues);
    });
    it('5d --> 6d', function () {
        var cAs5D = tf.reshape(c, [1, 1, 1, 5, 3]);
        var cAs6D = tf.reshape(cAs5D, [3, 5, 1, 1, 1, 1]);
        test_util_1.expectArraysClose(cAs6D, cValues);
    });
});
jasmine_util_1.describeWithFlags('expensive reshape with even columns', test_util_1.PACKED_ENVS, function () {
    it('2 --> 4 columns', function () {
        var maxTextureSize = tf.ENV.get('WEBGL_MAX_TEXTURE_SIZE');
        var values = new Array(16).fill(0);
        values = values.map(function (d, i) { return i + 1; });
        var a = tf.tensor2d(values, [8, 2]);
        var b = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        tf.ENV.set('WEBGL_MAX_TEXTURE_SIZE', 2);
        var c = tf.matMul(a, b);
        var cAs4D = c.reshape([2, 1, 2, 4]);
        tf.ENV.set('WEBGL_MAX_TEXTURE_SIZE', maxTextureSize);
        var webglPackFlagSaved = tf.ENV.get('WEBGL_PACK');
        tf.ENV.set('WEBGL_PACK', false);
        cAs4D = cAs4D.add(1);
        cAs4D = cAs4D.add(-1);
        tf.ENV.set('WEBGL_PACK', webglPackFlagSaved);
        var result = [7, 10, 15, 22, 23, 34, 31, 46, 39, 58, 47, 70, 55, 82, 63, 94];
        test_util_1.expectArraysClose(cAs4D, result);
    });
});
//# sourceMappingURL=reshape_packed_test.js.map