"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("./index");
var jasmine_util_1 = require("./jasmine_util");
var test_util_1 = require("./test_util");
jasmine_util_1.describeWithFlags('tf.buffer', test_util_1.ALL_ENVS, function () {
    it('float32', function () {
        var buff = tf.buffer([1, 2, 3], 'float32');
        buff.set(1.3, 0, 0, 0);
        buff.set(2.9, 0, 1, 0);
        expect(buff.get(0, 0, 0)).toBeCloseTo(1.3);
        expect(buff.get(0, 0, 1)).toBeCloseTo(0);
        expect(buff.get(0, 0, 2)).toBeCloseTo(0);
        expect(buff.get(0, 1, 0)).toBeCloseTo(2.9);
        expect(buff.get(0, 1, 1)).toBeCloseTo(0);
        expect(buff.get(0, 1, 2)).toBeCloseTo(0);
        test_util_1.expectArraysClose(buff.toTensor(), [1.3, 0, 0, 2.9, 0, 0]);
        test_util_1.expectArraysClose(buff.values, new Float32Array([1.3, 0, 0, 2.9, 0, 0]));
    });
    it('int32', function () {
        var buff = tf.buffer([2, 3], 'int32');
        buff.set(1.3, 0, 0);
        buff.set(2.1, 1, 1);
        expect(buff.get(0, 0)).toEqual(1);
        expect(buff.get(0, 1)).toEqual(0);
        expect(buff.get(0, 2)).toEqual(0);
        expect(buff.get(1, 0)).toEqual(0);
        expect(buff.get(1, 1)).toEqual(2);
        expect(buff.get(1, 2)).toEqual(0);
        test_util_1.expectArraysClose(buff.toTensor(), [1, 0, 0, 0, 2, 0]);
        test_util_1.expectArraysClose(buff.values, new Int32Array([1, 0, 0, 0, 2, 0]));
    });
    it('bool', function () {
        var buff = tf.buffer([4], 'bool');
        buff.set(true, 1);
        buff.set(true, 2);
        expect(buff.get(0)).toBeFalsy();
        expect(buff.get(1)).toBeTruthy();
        expect(buff.get(2)).toBeTruthy();
        expect(buff.get(3)).toBeFalsy();
        test_util_1.expectArraysClose(buff.toTensor(), [0, 1, 1, 0]);
        test_util_1.expectArraysClose(buff.values, new Uint8Array([0, 1, 1, 0]));
    });
    it('string', function () {
        var buff = tf.buffer([2, 2], 'string');
        buff.set('first', 0, 0);
        buff.set('third', 1, 0);
        expect(buff.get(0, 0)).toEqual('first');
        expect(buff.get(0, 1)).toBeFalsy();
        expect(buff.get(1, 0)).toEqual('third');
        expect(buff.get(1, 1)).toBeFalsy();
        test_util_1.expectArraysEqual(buff.toTensor(), ['first', null, 'third', null]);
    });
});
//# sourceMappingURL=buffer_test.js.map