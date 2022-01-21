"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINEAR = "return x;";
exports.LOG = "\n  vec4 result = log(x);\n  vec4 isNaN = vec4(lessThan(x, vec4(0.0)));\n  result.r = isNaN.r == 1.0 ? NAN : result.r;\n  result.g = isNaN.g == 1.0 ? NAN : result.g;\n  result.b = isNaN.b == 1.0 ? NAN : result.b;\n  result.a = isNaN.a == 1.0 ? NAN : result.a;\n\n  return result;\n";
exports.RELU = "\n  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));\n\n  result.r = isNaN(x.r) ? x.r : result.r;\n  result.g = isNaN(x.g) ? x.g : result.g;\n  result.b = isNaN(x.b) ? x.b : result.b;\n  result.a = isNaN(x.a) ? x.a : result.a;\n\n  return result;\n";
var UnaryOpPackedProgram = (function () {
    function UnaryOpPackedProgram(aShape, opSnippet) {
        this.variableNames = ['A'];
        this.usesPackedTextures = true;
        this.outputShape = aShape;
        this.userCode = "\n      uniform float NAN;\n      vec4 unaryOperation(vec4 x) {\n        " + opSnippet + "\n      }\n\n      void main() {\n        vec4 x = getAAtOutCoords();\n        vec4 y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
    }
    UnaryOpPackedProgram.prototype.getCustomSetupFunc = function () {
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
    return UnaryOpPackedProgram;
}());
exports.UnaryOpPackedProgram = UnaryOpPackedProgram;
//# sourceMappingURL=unaryop_packed_gpu.js.map