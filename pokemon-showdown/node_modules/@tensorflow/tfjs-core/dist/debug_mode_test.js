"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("./index");
var jasmine_util_1 = require("./jasmine_util");
var tensor_util_env_1 = require("./tensor_util_env");
var test_util_1 = require("./test_util");
jasmine_util_1.describeWithFlags('debug on', test_util_1.ALL_ENVS, function () {
    beforeAll(function () {
        tf.ENV.set('DEBUG', true);
    });
    afterAll(function () {
        tf.ENV.set('DEBUG', false);
    });
    it('debug mode does not error when no nans', function () {
        var a = tf.tensor1d([2, -1, 0, 3]);
        var res = tf.relu(a);
        test_util_1.expectArraysClose(res, [2, 0, 0, 3]);
    });
    it('debug mode errors when nans in tensor construction, float32', function () {
        var a = function () { return tf.tensor1d([2, NaN], 'float32'); };
        expect(a).toThrowError();
    });
    it('debug mode errors when nans in tensor construction, int32', function () {
        var a = function () { return tf.tensor1d([2, NaN], 'int32'); };
        expect(a).toThrowError();
    });
    it('debug mode errors when Infinity in tensor construction', function () {
        var a = function () { return tf.tensor1d([2, Infinity], 'float32'); };
        expect(a).toThrowError();
    });
    it('debug mode errors when nans in tensor created from TypedArray', function () {
        var a = function () { return tf.tensor1d(new Float32Array([1, 2, NaN]), 'float32'); };
        expect(a).toThrowError();
    });
    it('debug mode errors when infinities in op output', function () {
        var a = tf.tensor1d([1, 2, 3, 4]);
        var b = tf.tensor1d([2, -1, 0, 3]);
        var c = function () { return a.div(b); };
        expect(c).toThrowError();
    });
    it('debug mode errors when nans in op output', function () {
        var a = tf.tensor1d([-1, 2]);
        var b = tf.tensor1d([0.5, 1]);
        var c = function () { return a.pow(b); };
        expect(c).toThrowError();
    });
    it('debug mode errors when nans in oneHot op (tensorlike), int32', function () {
        var f = function () { return tf.oneHot([2, NaN], 3); };
        expect(f).toThrowError();
    });
    it('debug mode errors when nan in convertToTensor, int32', function () {
        var a = function () { return tensor_util_env_1.convertToTensor(NaN, 'a', 'test', 'int32'); };
        expect(a).toThrowError();
    });
    it('debug mode errors when nan in convertToTensor array input, int32', function () {
        var a = function () { return tensor_util_env_1.convertToTensor([NaN], 'a', 'test', 'int32'); };
        expect(a).toThrowError();
    });
    it('A x B', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6], [2, 3]);
        var b = tf.tensor2d([0, 1, -3, 2, 2, 1], [3, 2]);
        var c = tf.matMul(a, b);
        expect(c.shape).toEqual([2, 2]);
        test_util_1.expectArraysClose(c, [0, 8, -3, 20]);
    });
});
jasmine_util_1.describeWithFlags('debug on webgl', test_util_1.WEBGL_ENVS, function () {
    beforeAll(function () {
        tf.ENV.set('DEBUG', true);
    });
    afterAll(function () {
        tf.ENV.set('DEBUG', false);
    });
    it('debug mode errors when overflow in tensor construction', function () {
        var savedRenderFloat32Flag = tf.ENV.get('WEBGL_RENDER_FLOAT32_ENABLED');
        tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', false);
        var a = function () { return tf.tensor1d([2, Math.pow(2, 17)], 'float32'); };
        expect(a).toThrowError();
        tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', savedRenderFloat32Flag);
    });
    it('debug mode errors when underflow in tensor construction', function () {
        var savedRenderFloat32Flag = tf.ENV.get('WEBGL_RENDER_FLOAT32_ENABLED');
        tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', false);
        var a = function () { return tf.tensor1d([2, 1e-8], 'float32'); };
        expect(a).toThrowError();
        tf.ENV.set('WEBGL_RENDER_FLOAT32_ENABLED', savedRenderFloat32Flag);
    });
});
jasmine_util_1.describeWithFlags('debug off', test_util_1.ALL_ENVS, function () {
    beforeAll(function () {
        tf.ENV.set('DEBUG', false);
    });
    it('no errors where there are nans, and debug mode is disabled', function () {
        var a = tf.tensor1d([2, NaN]);
        var res = tf.relu(a);
        test_util_1.expectArraysClose(res, [2, NaN]);
    });
});
//# sourceMappingURL=debug_mode_test.js.map