"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComplexAbsProgram = (function () {
    function ComplexAbsProgram(shape) {
        this.variableNames = ['real', 'imag'];
        this.outputShape = shape;
        this.userCode = "\n      void main() {\n        float re = abs(getRealAtOutCoords());\n        float im = abs(getImagAtOutCoords());\n        float mx = max(re, im);\n\n        // sadly the length function in glsl is not underflow-safe\n        // (at least not on Intel GPUs). So the safe solution is\n        // to ensure underflow-safety in all cases.\n        setOutput(\n          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))\n        );\n      }\n    ";
    }
    return ComplexAbsProgram;
}());
exports.ComplexAbsProgram = ComplexAbsProgram;
//# sourceMappingURL=complex_abs_gpu.js.map