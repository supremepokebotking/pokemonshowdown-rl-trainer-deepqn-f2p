"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var test_util_1 = require("../test_util");
var backend_cpu_1 = require("./backend_cpu");
describe('backendCPU', function () {
    var prevBackend;
    var backend;
    beforeAll(function () {
        prevBackend = tf.getBackend();
    });
    beforeEach(function () {
        backend = new backend_cpu_1.MathBackendCPU();
        tf.ENV.registerBackend('test-storage', function () { return backend; });
        tf.setBackend('test-storage');
    });
    afterEach(function () {
        backend.dispose();
        tf.setBackend(prevBackend);
        tf.ENV.removeBackend('test-storage');
    });
    it('register empty string tensor', function () {
        var t = tf.Tensor.make([3], {}, 'string');
        expect(backend.readSync(t.dataId) == null).toBe(true);
    });
    it('register empty string tensor and write', function () {
        var t = tf.Tensor.make([3], {}, 'string');
        backend.write(t.dataId, ['c', 'a', 'b']);
        test_util_1.expectArraysEqual(backend.readSync(t.dataId), ['c', 'a', 'b']);
    });
    it('register string tensor with values', function () {
        var t = tf.Tensor.make([3], { values: ['a', 'b', 'c'] }, 'string');
        test_util_1.expectArraysEqual(backend.readSync(t.dataId), ['a', 'b', 'c']);
    });
    it('register string tensor with values and overwrite', function () {
        var t = tf.Tensor.make([3], { values: ['a', 'b', 'c'] }, 'string');
        backend.write(t.dataId, ['c', 'a', 'b']);
        test_util_1.expectArraysEqual(backend.readSync(t.dataId), ['c', 'a', 'b']);
    });
    it('register string tensor with values and mismatched shape', function () {
        expect(function () { return tf.tensor(['a', 'b', 'c'], [4], 'string'); }).toThrowError();
    });
});
//# sourceMappingURL=backend_cpu_test.js.map