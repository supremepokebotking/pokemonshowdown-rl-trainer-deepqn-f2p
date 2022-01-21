"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClipPackedProgram = (function () {
    function ClipPackedProgram(aShape) {
        this.variableNames = ['A'];
        this.usesPackedTextures = true;
        this.outputShape = aShape;
        this.userCode = "\n      uniform float min;\n      uniform float max;\n\n      void main() {\n        vec4 value = getAAtOutCoords();\n\n        if (hasNaN(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, vec4(min), vec4(max)));\n      }\n    ";
    }
    ClipPackedProgram.prototype.getCustomSetupFunc = function (min, max) {
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
    return ClipPackedProgram;
}());
exports.ClipPackedProgram = ClipPackedProgram;
//# sourceMappingURL=clip_packed_gpu.js.map