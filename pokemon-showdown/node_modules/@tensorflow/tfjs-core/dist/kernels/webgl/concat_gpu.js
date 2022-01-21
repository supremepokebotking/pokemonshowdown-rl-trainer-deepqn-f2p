"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var concat_util = require("../../ops/concat_util");
var ConcatProgram = (function () {
    function ConcatProgram(shapes) {
        this.outputShape = [];
        this.outputShape = concat_util.computeOutShape(shapes, 1);
        this.variableNames = shapes.map(function (_, i) { return "T" + i; });
        var offsets = new Array(shapes.length - 1);
        offsets[0] = shapes[0][1];
        for (var i = 1; i < offsets.length; i++) {
            offsets[i] = offsets[i - 1] + shapes[i][1];
        }
        var snippets = ["if (yC < " + offsets[0] + ") setOutput(getT0(yR, yC));"];
        for (var i = 1; i < offsets.length; i++) {
            var shift = offsets[i - 1];
            snippets.push("else if (yC < " + offsets[i] + ") " +
                ("setOutput(getT" + i + "(yR, yC-" + shift + "));"));
        }
        var lastIndex = offsets.length;
        var lastShift = offsets[offsets.length - 1];
        snippets.push("else setOutput(getT" + lastIndex + "(yR, yC-" + lastShift + "));");
        this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        " + snippets.join('\n        ') + "\n      }\n    ";
    }
    return ConcatProgram;
}());
exports.ConcatProgram = ConcatProgram;
//# sourceMappingURL=concat_gpu.js.map