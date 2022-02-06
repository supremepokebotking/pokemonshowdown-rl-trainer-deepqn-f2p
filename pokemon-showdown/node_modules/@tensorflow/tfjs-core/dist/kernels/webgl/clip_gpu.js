"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClipProgram = (function () {
    function ClipProgram(aShape) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        this.userCode = "\n      uniform float min;\n      uniform float max;\n\n      void main() {\n        float value = getAAtOutCoords();\n        if (isNaN(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, min, max));\n      }\n    ";
    }
    ClipProgram.prototype.getCustomSetupFunc = function (min, max) {
        var _this = this;
        return function (gpgpu, webGLProgram) {
            if (_this.minLoc == null) {
                _this.minLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'min');
                _this.maxLoc = gpgpu.getUniformLocationNoThrow(webGLProgram, 'max');
            }
            gpgpu.gl.uniform1f(_this.minLoc, min);
            gpgpu.gl.uniform1f(_this.maxLoc, max);
        };
    };
    return ClipProgram;
}());
exports.ClipProgram = ClipProgram;
//# sourceMappingURL=clip_gpu.js.map