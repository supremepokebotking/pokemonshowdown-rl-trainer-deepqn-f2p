"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("../../environment");
function getGlslDifferences() {
    var version;
    var attribute;
    var varyingVs;
    var varyingFs;
    var texture2D;
    var output;
    var defineOutput;
    var defineRound;
    if (environment_1.ENV.get('WEBGL_VERSION') === 2) {
        version = '#version 300 es';
        attribute = 'in';
        varyingVs = 'out';
        varyingFs = 'in';
        texture2D = 'texture';
        output = 'outputColor';
        defineOutput = 'out vec4 outputColor;';
        defineRound = "\n      #define round(value) newRound(value)\n      int newRound(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 newRound(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    ";
    }
    else {
        version = '';
        attribute = 'attribute';
        varyingVs = 'varying';
        varyingFs = 'varying';
        texture2D = 'texture2D';
        output = 'gl_FragColor';
        defineOutput = '';
        defineRound = "\n      int round(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 round(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    ";
    }
    return {
        version: version,
        attribute: attribute,
        varyingVs: varyingVs,
        varyingFs: varyingFs,
        texture2D: texture2D,
        output: output,
        defineOutput: defineOutput,
        defineRound: defineRound
    };
}
exports.getGlslDifferences = getGlslDifferences;
//# sourceMappingURL=glsl_version.js.map