"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
exports.PACKED_DIV = "\n  // vec4 one = vec4(equal(a, b));\n  // return one + (vec4(1.0) - one) * a / b;\n  vec4 result = a / b;\n  result.x = a.x == b.x ? 1. : result.x;\n  result.y = a.y == b.y ? 1. : result.y;\n  result.z = a.z == b.z ? 1. : result.z;\n  result.w = a.w == b.w ? 1. : result.w;\n  return result;\n";
exports.PACKED_INT_DIV = "\n  vec4 resultSign = sign(a) * sign(b);\n  ivec4 ia = round(a);\n  ivec4 ib = round(b);\n  ivec4 result = ia / ib;\n  ivec4 amodb = ia - ib * result;\n\n  // Vectorize INT_DIV\n  // if (resultSign < 0.0 && amodb != 0) result -= 1;\n  // return float(result);\n  return vec4(result -\n     ivec4(lessThan(resultSign, vec4(0.0))) * ivec4(notEqual(amodb, ivec4(0))));\n";
exports.PACKED_POW = "\n  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.\n  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));\n  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);\n  vec4 result = multiplier * pow(abs(a), b);\n\n  vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));\n  result.r = isNaN.r == 1.0 ? NAN : result.r;\n  result.g = isNaN.g == 1.0 ? NAN : result.g;\n  result.b = isNaN.b == 1.0 ? NAN : result.b;\n  result.a = isNaN.a == 1.0 ? NAN : result.a;\n\n  return result;\n";
var BinaryOpPackedProgram = (function () {
    function BinaryOpPackedProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.usesPackedTextures = true;
        this.outputShape =
            broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = "\n      uniform float NAN;\n      vec4 binaryOperation(vec4 a, vec4 b) {\n        " + op + "\n      }\n\n      void main() {\n        vec4 a = getAAtOutCoords();\n        vec4 b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
    }
    BinaryOpPackedProgram.prototype.getCustomSetupFunc = function () {
        var _this = this;
        return function (gpgpu, webGLProgram) {
            if (_this.startLoc == null) {
                _this.startLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'NAN');
                if (_this.startLoc == null) {
                    return;
                }
            }
            gpgpu.gl.uniform1f(_this.startLoc, NaN);
        };
    };
    return BinaryOpPackedProgram;
}());
exports.BinaryOpPackedProgram = BinaryOpPackedProgram;
//# sourceMappingURL=binaryop_packed_gpu.js.map