"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
describe('upcastType', function () {
    it('upcasts bool to bool', function () {
        expect(types_1.upcastType('bool', 'bool')).toBe('bool');
    });
    it('upcasts bool/int32 to int32', function () {
        expect(types_1.upcastType('bool', 'int32')).toBe('int32');
        expect(types_1.upcastType('int32', 'int32')).toBe('int32');
    });
    it('upcasts bool/int32/float32 to float32', function () {
        expect(types_1.upcastType('bool', 'float32')).toBe('float32');
        expect(types_1.upcastType('int32', 'float32')).toBe('float32');
        expect(types_1.upcastType('float32', 'float32')).toBe('float32');
    });
    it('upcasts bool/int32/float32/complex64 to complex64', function () {
        expect(types_1.upcastType('bool', 'complex64')).toBe('complex64');
        expect(types_1.upcastType('int32', 'complex64')).toBe('complex64');
        expect(types_1.upcastType('float32', 'complex64')).toBe('complex64');
        expect(types_1.upcastType('complex64', 'complex64')).toBe('complex64');
    });
    it('fails to upcast anything other than string with string', function () {
        expect(function () { return types_1.upcastType('bool', 'string'); }).toThrowError();
        expect(function () { return types_1.upcastType('int32', 'string'); }).toThrowError();
        expect(function () { return types_1.upcastType('float32', 'string'); }).toThrowError();
        expect(function () { return types_1.upcastType('complex64', 'string'); }).toThrowError();
        expect(types_1.upcastType('string', 'string')).toBe('string');
    });
});
//# sourceMappingURL=types_test.js.map